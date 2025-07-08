
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGroup } from "@/components/group-provider";
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, CheckSquare, FileText, Bell } from "lucide-react";
import type { Project, Task, Document, GroupMember } from '@/lib/types';
import type { Timestamp } from 'firebase/firestore';

type Activity = {
    id: string;
    type: 'project' | 'task' | 'document';
    text: string;
    user: GroupMember | { displayName: string, photoURL?: string };
    timestamp: Timestamp;
    icon: React.ElementType;
};

const getActor = (uid: string, members: GroupMember[], uploaderName?: string, uploaderPhotoURL?: string) => {
    const member = members.find(m => m.uid === uid);
    if (member) return member;
    return { displayName: uploaderName || 'Unknown User', photoURL: uploaderPhotoURL };
};

export default function NotificationsPage() {
  const { projects, tasks, documents, members } = useGroup();

  const activityFeed = React.useMemo(() => {
    const activities: Activity[] = [];

    projects.forEach(project => {
      activities.push({
        id: project.id,
        type: 'project',
        text: `created a new project: "${project.name}"`,
        user: getActor(project.createdBy, members),
        timestamp: project.createdAt,
        icon: Briefcase
      });
    });

    tasks.forEach(task => {
        activities.push({
            id: task.id,
            type: 'task',
            text: `created a new task: "${task.title}"`,
            user: getActor(task.createdBy, members),
            timestamp: task.createdAt,
            icon: CheckSquare
        });
    });
    
    documents.forEach(doc => {
        activities.push({
            id: doc.id,
            type: 'document',
            text: `uploaded a new document: "${doc.name}"`,
            user: getActor(doc.uploadedBy, members, doc.uploaderName, doc.uploaderPhotoURL),
            timestamp: doc.uploadedAt,
            icon: FileText
        });
    });

    return activities.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
  }, [projects, tasks, documents, members]);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">A log of recent activity in your workspace.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>The latest updates from your team.</CardDescription>
        </CardHeader>
        <CardContent>
          {activityFeed.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-96 bg-secondary/30 rounded-lg">
                <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-xl">No Activity Yet</h3>
                <p className="text-sm text-muted-foreground mt-2">Create a task or upload a document to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activityFeed.map(activity => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="p-2 bg-secondary rounded-full">
                    <activity.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.user.displayName}</span>
                      {' '}
                      {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
