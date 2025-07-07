import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, GanttChart, ListTodo, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, User!</h1>
        <p className="text-muted-foreground">Here's a summary of your workspace.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <GanttChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 waiting for review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">+10 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://placehold.co/40x40/png" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://placehold.co/40x40/png" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarImage src="https://placehold.co/40x40/png" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarFallback>+5</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs text-muted-foreground mt-2">8 members online</p>
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
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Design landing page mockups</TableCell>
                  <TableCell>Website Redesign</TableCell>
                  <TableCell>
                    <Badge variant="secondary">In Progress</Badge>
                  </TableCell>
                  <TableCell>Tomorrow</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Setup CI/CD pipeline</TableCell>
                  <TableCell>Project Phoenix</TableCell>
                  <TableCell>
                    <Badge>To Do</Badge>
                  </TableCell>
                  <TableCell>In 3 days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Review PR #245</TableCell>
                  <TableCell>API Development</TableCell>
                  <TableCell>
                    <Badge>To Do</Badge>
                  </TableCell>
                  <TableCell>October 25, 2024</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>An overview of your active project timelines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Website Redesign</h4>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Project Phoenix</h4>
                <span className="text-sm text-muted-foreground">33%</span>
              </div>
              <Progress value={33} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">API Development</h4>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <Progress value={90} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Mobile App Q4</h4>
                <span className="text-sm text-muted-foreground">15%</span>
              </div>
              <Progress value={15} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
