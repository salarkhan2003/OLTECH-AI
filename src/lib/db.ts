import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  writeBatch,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, storage, auth } from './firebase';
import type { UserProfile, Group, Task, Project, Document, GroupMember } from './types';
import { customAlphabet } from 'nanoid';
import type { User } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

// User Profile Functions
export const createUserProfile = async (user: User) => {
  const userProfileRef = doc(db, 'users', user.uid);
  const newUserProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    groupId: null,
  };
  await setDoc(userProfileRef, newUserProfile);
  return newUserProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userProfileRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userProfileRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (userProfile: UserProfile, data: Partial<UserProfile>) => {
    if (!userProfile?.uid) {
        throw new Error("Cannot update profile for a user without a UID.");
    }
    
    // If displayName is being updated, update Firebase Auth profile as well
    if (auth.currentUser && data.displayName && data.displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
    }

    const batch = writeBatch(db);
    
    const userRef = doc(db, 'users', userProfile.uid);
    batch.update(userRef, data);

    // If the user is in a group, also update their denormalized data in /groups/{groupId}/members/{uid}
    if (userProfile.groupId) {
        const memberRef = doc(db, 'groups', userProfile.groupId, 'members', userProfile.uid);
        
        const memberData: { [key: string]: any } = {};
        
        // Map all potential fields from UserProfile to GroupMember
        if (data.displayName !== undefined) memberData.displayName = data.displayName;
        if (data.photoURL !== undefined) memberData.photoURL = data.photoURL;
        if (data.title !== undefined) memberData.title = data.title;
        if (data.department !== undefined) memberData.department = data.department;

        if (Object.keys(memberData).length > 0) {
            batch.update(memberRef, memberData);
        }
    }

    await batch.commit();
};


// Group Functions
export const createGroup = async (groupName: string, user: UserProfile): Promise<Group> => {
  const batch = writeBatch(db);
  const groupId = doc(collection(db, 'groups')).id;
  const joinCode = nanoid();

  const newGroup: Group = {
    id: groupId,
    name: groupName,
    joinCode,
    createdAt: serverTimestamp(),
    createdBy: user.uid,
  };

  const groupRef = doc(db, 'groups', groupId);
  batch.set(groupRef, newGroup);

  const memberRef = doc(db, 'groups', groupId, 'members', user.uid);
  batch.set(memberRef, {
    uid: user.uid,
    role: 'admin',
    joinedAt: serverTimestamp(),
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    email: user.email || '',
    title: user.title || '',
    department: user.department || '',
  });

  const userRef = doc(db, 'users', user.uid);
  batch.update(userRef, { groupId: groupId });

  await batch.commit();
  return newGroup;
};

export const joinGroup = async (joinCode: string, user: UserProfile): Promise<Group | null> => {
  const groupsRef = collection(db, 'groups');
  const q = query(groupsRef, where('joinCode', '==', joinCode.toUpperCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Invalid join code.');
  }

  const groupDoc = querySnapshot.docs[0];
  const group = groupDoc.data() as Group;

  const batch = writeBatch(db);

  const memberRef = doc(db, 'groups', group.id, 'members', user.uid);
  batch.set(memberRef, {
    uid: user.uid,
    role: 'member',
    joinedAt: serverTimestamp(),
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    email: user.email || '',
    title: user.title || '',
    department: user.department || '',
  });

  const userRef = doc(db, 'users', user.uid);
  batch.update(userRef, { groupId: group.id });

  await batch.commit();
  return group;
};

// Project Functions
export const createProject = async (groupId: string, projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const projectId = doc(collection(db, 'groups', groupId, 'projects')).id;
    const projectRef = doc(db, 'groups', groupId, 'projects', projectId);
    await setDoc(projectRef, {
        ...projectData,
        id: projectId,
        createdAt: serverTimestamp(),
    });
};

export const updateProject = async (groupId: string, projectId: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'createdBy'>>) => {
    const projectRef = doc(db, 'groups', groupId, 'projects', projectId);
    await updateDoc(projectRef, data);
};

export const deleteProject = async (groupId: string, projectId: string) => {
    const projectRef = doc(db, 'groups', groupId, 'projects', projectId);
    await deleteDoc(projectRef);
};


// Task Functions
export const createTask = async (groupId: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const taskId = doc(collection(db, 'groups', groupId, 'tasks')).id;
    const taskRef = doc(db, 'groups', groupId, 'tasks', taskId);
    await setDoc(taskRef, {
        ...taskData,
        id: taskId,
        createdAt: serverTimestamp(),
    });
};

export const updateTask = async (groupId: string, taskId: string, data: Partial<Task>) => {
    const taskRef = doc(db, 'groups', groupId, 'tasks', taskId);
    await updateDoc(taskRef, data);
};

// Document Functions
export const uploadDocument = (
    groupId: string,
    user: UserProfile,
    data: { file: File, description?: string, projectId?: string, taskId?: string },
    onProgress: (progress: number) => void
): Promise<Document> => {
  return new Promise((resolve, reject) => {
    const { file, description, projectId, taskId } = data;
    const docId = doc(collection(db, 'groups', groupId, 'documents')).id;
    const storagePath = `groups/${groupId}/documents/${docId}/${file.name}`;
    const storageRef = ref(storage, storagePath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            const docRef = doc(db, 'groups', groupId, 'documents', docId);

            const newDocument: Document = {
                id: docId,
                name: file.name,
                url,
                path: storagePath,
                fileType: file.type || 'unknown',
                size: file.size,
                uploadedAt: serverTimestamp(),
                uploadedBy: user.uid,
                uploaderName: user.displayName,
                uploaderPhotoURL: user.photoURL,
                description: description || '',
                projectId: projectId || null,
                taskId: taskId || null,
            };

            await setDoc(docRef, newDocument);
            resolve(newDocument);
        } catch (error) {
            console.error("Error in upload completion callback:", error);
            reject(error);
        }
      }
    );
  });
};


export const deleteDocument = async (groupId: string, document: Document) => {
    const storageRef = ref(storage, document.path);
    await deleteObject(storageRef);

    const docRef = doc(db, 'groups', groupId, 'documents', document.id);
    await deleteDoc(docRef);
};

// Team Management Functions
export const updateMemberRole = async (groupId: string, memberId: string, role: 'admin' | 'member') => {
    const memberRef = doc(db, 'groups', groupId, 'members', memberId);
    await updateDoc(memberRef, { role });
};

export const removeMemberFromGroup = async (groupId: string, memberId: string) => {
    const batch = writeBatch(db);
    
    const memberRef = doc(db, 'groups', groupId, 'members', memberId);
    batch.delete(memberRef);

    const userRef = doc(db, 'users', memberId);
    batch.update(userRef, { groupId: null });

    await batch.commit();
};
