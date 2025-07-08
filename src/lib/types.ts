import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  groupId?: string | null;
  // Extended profile
  title?: string;
  department?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  timezone?: string;
};

export type Group = {
  id: string;
  name: string;
  joinCode: string;
  createdAt: Timestamp;
  createdBy: string;
};

export type GroupMember = {
  uid: string;
  role: 'admin' | 'member';
  joinedAt: Timestamp;
  // Denormalized user data for easy access
  displayName?: string;
  photoURL?: string;
  email?: string;
  title?: string;
  department?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: 'On Track' | 'At Risk' | 'Off Track' | 'Completed';
  dueDate?: Timestamp | null;
  createdAt: Timestamp;
  createdBy: string; // UID
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  deadline?: Timestamp | null;
  assignedTo: string; // UID of the assigned user
  createdBy: string; // UID of the user who created the task
  createdAt: Timestamp;
  projectId?: string | null;
  // Denormalized assignee data
  assigneeName?: string;
  assigneePhotoURL?: string;
};

export type Document = {
  id: string; // Corresponds to the document ID in Firestore
  name: string;
  url: string;
  path: string; // The full path in Firebase Storage
  fileType: string;
  size: number; // in bytes
  uploadedAt: Timestamp;
  uploadedBy: string; // UID of uploader
  uploaderName?: string;
  uploaderPhotoURL?: string;
  description?: string;
  projectId?: string | null;
  taskId?: string | null;
};
