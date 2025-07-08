'use client';

import * as React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Calendar, Flag } from "lucide-react";
import { useGroup } from '@/components/group-provider';
import type { Task, GroupMember } from '@/lib/types';
import { CreateTaskDialog } from '@/components/dashboard/create-task-dialog';
import { TaskDetailsDialog } from '@/components/dashboard/task-details-dialog';
import { format } from 'date-fns';

const priorityVariant: { [key in Task['priority']]: "destructive" | "secondary" | "outline" } = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
};

function TaskCard({ task, member, onCardClick }: { task: Task, member?: GroupMember, onCardClick: () => void }) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-card cursor-pointer" onClick={onCardClick}>
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

function TaskColumn({ title, tasks, members, onTaskClick }: { title: string, tasks: Task[], members: GroupMember[], onTaskClick: (task: Task) => void }) {
  const membersMap = React.useMemo(() => new Map(members.map(m => [m.uid, m])), [members]);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-tight">{title} <span className="text-sm font-normal text-muted-foreground">({tasks.length})</span></h2>
      </div>
      <div className="space-y-4 rounded-lg bg-secondary/50 p-4 min-h-[500px]">
        {tasks.map(task => <TaskCard key={task.id} task={task} member={membersMap.get(task.assignedTo)} onCardClick={() => onTaskClick(task)} />)}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { tasks, members } = useGroup();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  
  const handleDetailsDialogClose = (open: boolean) => {
    if (!open) {
        setSelectedTask(null);
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks Board</h1>
          <p className="text-muted-foreground">Manage your team's workflow.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <CreateTaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      
      <TaskDetailsDialog 
        task={selectedTask} 
        open={!!selectedTask} 
        onOpenChange={handleDetailsDialogClose} 
      />

      <div className="flex flex-col gap-8 md:flex-row">
        <TaskColumn title="To Do" tasks={todoTasks} members={members} onTaskClick={handleTaskClick} />
        <TaskColumn title="In Progress" tasks={inProgressTasks} members={members} onTaskClick={handleTaskClick} />
        <TaskColumn title="Done" tasks={doneTasks} members={members} onTaskClick={handleTaskClick} />
      </div>
    </main>
  );
}
