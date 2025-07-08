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
import { db, storage } from './firebase';
import type { UserProfile, Group, Task, Project, Document } from './types';
import { customAlphabet } from 'nanoid';
import type { User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userProfileRef = doc(db, 'users', uid);
    await updateDoc(userProfileRef, data);
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
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
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
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
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

// Task Functions
export const createTask = async (groupId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
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
export const uploadDocument = async (groupId: string, file: File, user: UserProfile, onProgress: (progress: number) => void) => {
    const docId = doc(collection(db, 'groups', groupId, 'documents')).id;
    const storagePath = `groups/${groupId}/documents/${docId}/${file.name}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(uploadTask.ref);

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
    };

    await setDoc(docRef, newDocument);
    return newDocument;
};

export const deleteDocument = async (groupId: string, document: Document) => {
    const storageRef = ref(storage, document.path);
    await deleteObject(storageRef);

    const docRef = doc(db, 'groups', groupId, 'documents', document.id);
    await deleteDoc(docRef);
};
