'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, GanttChart, ListTodo, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useGroup } from '@/components/group-provider';
import { useAuth } from '@/components/auth-provider';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { members, tasks } = useGroup();

  const tasksInProgress = tasks.filter(t => t.status === 'In Progress').length;
  const tasksToDo = tasks.filter(t => t.status === 'To Do').length;
  const tasksCompleted = tasks.filter(t => t.status === 'Done').length;
  const totalTasks = tasks.length;

  const myOpenTasks = tasks.filter(t => t.assignedTo === userProfile?.uid && t.status !== 'Done');

  const projectProgress = tasks.length > 0 ? (tasksCompleted / tasks.length) * 100 : 0;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userProfile?.displayName}!</h1>
        <p className="text-muted-foreground">Here's a summary of your team's workspace.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <GanttChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{tasksToDo} to do</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksInProgress}</div>
            <p className="text-xs text-muted-foreground">Keep up the momentum!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">Great work team!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2">
              {members.slice(0, 5).map(member => (
                <Avatar key={member.uid} className="border-2 border-background">
                  <AvatarImage src={member.photoURL ?? ''} />
                  <AvatarFallback>{member.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {members.length > 5 && (
                <Avatar className="border-2 border-background">
                  <AvatarFallback>+{members.length - 5}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{members.length} members in this group</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Open Tasks</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/tasks">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <CardDescription>Tasks assigned to you that are not yet completed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myOpenTasks.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            You have no open tasks. Great job!
                        </TableCell>
                    </TableRow>
                )}
                {myOpenTasks.slice(0, 5).map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{task.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {task.deadline ? formatDistanceToNow(task.deadline.toDate(), { addSuffix: true }) : 'No due date'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overall Project Progress</CardTitle>
            <CardDescription>An overview of your team's task completion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 flex flex-col justify-center items-center h-full">
            <div className="relative h-40 w-40">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                        className="text-secondary"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="text-primary"
                        strokeDasharray={`${projectProgress}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{Math.round(projectProgress)}%</span>
                </div>
            </div>
             <p className="text-muted-foreground text-center">
                {tasksCompleted} of {totalTasks} tasks completed.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
