import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Paperclip, PlusCircle } from "lucide-react";

type Task = {
  id: string;
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  assignee: string;
  comments: number;
  attachments: number;
};

const tasks: Task[] = [
  { id: 'task-1', title: 'Design the new user dashboard', project: 'Website Redesign', priority: 'High', status: 'In Progress', assignee: 'U1', comments: 3, attachments: 2 },
  { id: 'task-2', title: 'Develop authentication endpoints', project: 'API Development', priority: 'High', status: 'In Progress', assignee: 'U2', comments: 5, attachments: 0 },
  { id: 'task-3', title: 'Create marketing copy for launch', project: 'Marketing Campaign', priority: 'Medium', status: 'To Do', assignee: 'U3', comments: 0, attachments: 1 },
  { id: 'task-4', title: 'Fix bug #1024 - Login button unresponsive', project: 'Project Phoenix', priority: 'High', status: 'To Do', assignee: 'U4', comments: 2, attachments: 0 },
  { id: 'task-5', title: 'Plan Q1 product roadmap', project: 'Strategy', priority: 'Medium', status: 'To Do', assignee: 'U5', comments: 8, attachments: 4 },
  { id: 'task-6', title: 'Finalize and approve budget', project: 'Strategy', priority: 'Low', status: 'Done', assignee: 'U5', comments: 10, attachments: 3 },
  { id: 'task-7', title: 'Onboard new junior developer', project: 'Team Management', priority: 'Medium', status: 'Done', assignee: 'U1', comments: 4, attachments: 5 },
];

const priorityVariant: { [key in Task['priority']]: "destructive" | "secondary" | "outline" } = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
};

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline">{task.project}</Badge>
          <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{task.title}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`https://placehold.co/40x40.png`} />
            <AvatarFallback>{task.assignee.charAt(1)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{task.comments}</span>
          </div>
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            <span>{task.attachments}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

function TaskColumn({ title, tasks }: { title: string, tasks: Task[] }) {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-tight">{title} <span className="text-sm font-normal text-muted-foreground">({tasks.length})</span></h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4 rounded-lg bg-secondary/50 p-4 min-h-[500px]">
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks Board</h1>
          <p className="text-muted-foreground">Drag and drop to manage your workflow.</p>
        </div>
        <Button>+ New Task</Button>
      </div>

      <div className="flex gap-8">
        <TaskColumn title="To Do" tasks={todoTasks} />
        <TaskColumn title="In Progress" tasks={inProgressTasks} />
        <TaskColumn title="Done" tasks={doneTasks} />
      </div>
    </main>
  );
}
