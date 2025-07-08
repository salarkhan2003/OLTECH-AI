'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Calendar, Flag, User, Briefcase, FileText, CheckCircle } from 'lucide-react';
import { useGroup } from '../group-provider';
import { updateTask } from '@/lib/db';
import type { Task } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

const taskStatusSchema = z.object({
  status: z.enum(['To Do', 'In Progress', 'Done']),
});

type TaskStatusFormValues = z.infer<typeof taskStatusSchema>;

export function TaskDetailsDialog({ task, open, onOpenChange }: { task: Task | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { group, members, projects, documents } = useGroup();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<TaskStatusFormValues>({
    resolver: zodResolver(taskStatusSchema),
    defaultValues: {
      status: task?.status ?? 'To Do',
    },
  });
  
  React.useEffect(() => {
    if (task) {
      form.reset({ status: task.status });
    }
  }, [task, form]);
  
  if (!task) return null;

  async function onSubmit(data: TaskStatusFormValues) {
    if (!group || !task) return;
    setIsLoading(true);

    try {
      await updateTask(group.id, task.id, {
        status: data.status,
      });

      toast({
        title: 'Task Updated',
        description: `"${task.title}" has been moved to ${data.status}.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the task. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const assignee = members.find(m => m.uid === task.assignedTo);
  const project = projects.find(p => p.id === task.projectId);
  const linkedDocuments = documents.filter(d => d.taskId === task.id);
  
  const priorityVariant: { [key in Task['priority']]: "destructive" | "secondary" | "outline" } = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
          <DialogDescription>
            View and update the details of this task.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-2 space-y-6">
                 <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Description</h3>
                    <p className="text-sm">{task.description || 'No description provided.'}</p>
                </div>
                
                {linkedDocuments.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Linked Documents</h3>
                        <div className="space-y-2">
                            {linkedDocuments.map(doc => (
                                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-md bg-secondary hover:bg-secondary/80">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm font-medium">{doc.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">Status</span>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} id="update-task-form" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="To Do">To Do</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                
                <Separator />
                
                 <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">Assignee</span>
                </div>
                {assignee && (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.photoURL ?? ''} />
                            <AvatarFallback>{assignee.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.displayName}</span>
                    </div>
                )}

                <Separator />
                
                <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">Priority</span>
                </div>
                <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                
                <Separator />

                {task.deadline && (
                    <>
                         <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold text-muted-foreground">Due Date</span>
                        </div>
                        <p className="text-sm">{format(task.deadline.toDate(), 'PPP')}</p>
                         <Separator />
                    </>
                )}
                
                {project && (
                    <>
                         <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold text-muted-foreground">Project</span>
                        </div>
                        <p className="text-sm">{project.name}</p>
                    </>
                )}
                
            </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
          <Button type="submit" form="update-task-form" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
