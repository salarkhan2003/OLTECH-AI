'use client';

import * as React from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import type { Group, GroupMember, Task, UserProfile, Project, Document } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface GroupContextType {
  group: Group | null;
  members: GroupMember[];
  projects: Project[];
  tasks: Task[];
  documents: Document[];
  loading: boolean;
}

const GroupContext = React.createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children, userProfile }: { children: React.ReactNode; userProfile: UserProfile }) {
  const groupId = userProfile.groupId;

  const [group, loadingGroup] = useDocumentData(
    groupId ? doc(db, 'groups', groupId) : null
  );

  const [members, loadingMembers] = useCollectionData(
    groupId ? collection(db, 'groups', groupId, 'members') : null
  );
  
  const [projects, loadingProjects] = useCollectionData(
    groupId ? query(collection(db, 'groups', groupId, 'projects'), orderBy('createdAt', 'desc')) : null
  );

  const [tasks, loadingTasks] = useCollectionData(
    groupId ? query(collection(db, 'groups', groupId, 'tasks'), orderBy('createdAt', 'desc')) : null
  );
  
  const [documents, loadingDocuments] = useCollectionData(
    groupId ? query(collection(db, 'groups', groupId, 'documents'), orderBy('uploadedAt', 'desc')) : null
  );

  const loading = loadingGroup || loadingMembers || loadingTasks || loadingProjects || loadingDocuments;

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const value = {
    group: group as Group | null,
    members: (members as GroupMember[]) || [],
    projects: (projects as Project[]) || [],
    tasks: (tasks as Task[]) || [],
    documents: (documents as Document[]) || [],
    loading,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export const useGroup = () => {
  const context = React.useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};
