'use client';

import * as React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Calendar, Flag } from "lucide-react";
import { useGroup } from '@/components/group-provider';
import type { Task, GroupMember } from '@/lib/types';
import { CreateTaskDialog } from '@/components/dashboard/create-task-dialog';
import { format } from 'date-fns';

const priorityVariant: { [key in Task['priority']]: "destructive" | "secondary" | "outline" } = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
};

function TaskCard({ task, member }: { task: Task, member?: GroupMember }) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-card">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Badge variant={priorityVariant[task.priority]}>
            <Flag className="mr-1 h-3 w-3" />
            {task.priority}
          </Badge>
          <Avatar className="h-7 w-7 border-2 border-background">
            <AvatarImage src={member?.photoURL ?? ''} />
            <AvatarFallback>{member?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="font-medium leading-snug">{task.title}</p>
        {task.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {task.deadline && (
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(task.deadline.toDate(), 'MMM d')}</span>
            </div>
        )}
      </CardFooter>
    </Card>
  )
}

function TaskColumn({ title, tasks, members }: { title: string, tasks: Task[], members: GroupMember[] }) {
  const membersMap = React.useMemo(() => new Map(members.map(m => [m.uid, m])), [members]);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-tight">{title} <span className="text-sm font-normal text-muted-foreground">({tasks.length})</span></h2>
      </div>
      <div className="space-y-4 rounded-lg bg-secondary/50 p-4 min-h-[500px]">
        {tasks.map(task => <TaskCard key={task.id} task={task} member={membersMap.get(task.assignedTo)} />)}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { tasks, members } = useGroup();
  const [open, setOpen] = React.useState(false);

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks Board</h1>
          <p className="text-muted-foreground">Manage your team's workflow.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <CreateTaskDialog open={open} onOpenChange={setOpen} />

      <div className="flex flex-col gap-8 md:flex-row">
        <TaskColumn title="To Do" tasks={todoTasks} members={members} />
        <TaskColumn title="In Progress" tasks={inProgressTasks} members={members} />
        <TaskColumn title="Done" tasks={doneTasks} members={members} />
      </div>
    </main>
  );
}
