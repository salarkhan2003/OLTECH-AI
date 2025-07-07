'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateStatusReportAction } from '@/lib/actions';
import { Bot, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters.'),
  teamProgress: z.string().min(10, 'Please provide some details on team progress.'),
  potentialIssues: z.string().optional(),
  stakeholders: z.string().min(3, 'Please list at least one stakeholder.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ReportGenerator() {
  const [report, setReport] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      teamProgress: '',
      potentialIssues: '',
      stakeholders: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReport('');

    try {
      const result = await generateStatusReportAction(values);

      if (result.success && result.data) {
        setReport(result.data.report);
        toast({
          title: 'Report Generated',
          description: 'Weekly status report created successfully.',
        });
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Status Report Generator
        </CardTitle>
        <CardDescription>
          Fill in the details below to automatically generate a weekly status report for your stakeholders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Website Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamProgress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Progress This Week</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Summarize key accomplishments and completed tasks..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="potentialIssues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potential Issues or Roadblocks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List any challenges, risks, or dependencies..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stakeholders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stakeholders</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe, Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
          </form>
        </Form>
        {report && (
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg border space-y-2">
            <h4 className="font-semibold text-lg">Generated Report:</h4>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
              {report}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
