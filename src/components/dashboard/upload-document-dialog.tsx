'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useGroup } from '../group-provider';
import { useAuth } from '../auth-provider';
import { uploadDocument } from '@/lib/db';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const uploadSchema = z.object({
  file: z.any()
    .refine((files) => files?.length == 1, "File is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`),
  description: z.string().max(500, "Description must be 500 characters or less.").optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function UploadDocumentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { group, projects, tasks } = useGroup();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
      description: '',
      projectId: '',
      taskId: '',
    },
  });

  const selectedProjectId = form.watch('projectId');
  
  // Decoupled task filtering: if a project is selected, filter tasks. Otherwise, show all tasks.
  const filteredTasks = React.useMemo(() => {
    if (selectedProjectId) {
        return tasks.filter(task => task.projectId === selectedProjectId);
    }
    return tasks; // Show all tasks if no project is selected
  }, [selectedProjectId, tasks]);

  async function onSubmit(data: UploadFormValues) {
    const file = data.file[0];
    if (!file || !group || !userProfile) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      await uploadDocument(
        group.id,
        userProfile,
        {
          file,
          description: data.description,
          projectId: data.projectId,
          taskId: data.taskId,
        },
        (progress) => {
          setUploadProgress(progress);
        }
      );
      toast({
        title: "Upload complete!",
        description: `"${file.name}" has been added to your documents.`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: 'destructive',
        title: "Upload Failed",
        description: "Could not upload the document. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (!open) {
      form.reset();
      setUploadProgress(0);
    }
  }, [open, form]);

  // Reset task selection if project changes
  React.useEffect(() => {
    form.setValue('taskId', '');
  }, [selectedProjectId, form]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload a New Document</DialogTitle>
          <DialogDescription>
            Add a file to your team's document hub. You can add a description and link it to a project or task.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={(e) => field.onChange(e.target.files)} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is this document for?" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Project (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taskId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Task (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedProjectId ? "Select a task" : "Select project first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredTasks.length > 0 ? filteredTasks.map(task => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        )) : <div className="p-2 text-sm text-muted-foreground">No tasks for this project.</div>}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            {isLoading && <Progress value={uploadProgress} className="w-full" />}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}