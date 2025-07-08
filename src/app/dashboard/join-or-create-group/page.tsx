'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth-provider';
import { createGroup, joinGroup } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const createGroupSchema = z.object({
  groupName: z.string().min(3, 'Group name must be at least 3 characters.'),
});

const joinGroupSchema = z.object({
  joinCode: z.string().length(6, 'Join code must be 6 characters long.'),
});

export default function JoinOrCreateGroupPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && userProfile?.groupId) {
      router.push('/dashboard');
    }
  }, [userProfile, authLoading, router]);

  const createForm = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { groupName: '' },
  });

  const joinForm = useForm<z.infer<typeof joinGroupSchema>>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: { joinCode: '' },
  });

  const handleCreateGroup = async (values: z.infer<typeof createGroupSchema>) => {
    if (!userProfile) return;
    setIsCreating(true);
    try {
      await createGroup(values.groupName, userProfile);
      toast({ title: 'Group created!', description: 'Welcome to your new workspace.' });
      router.push('/dashboard');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create group.' });
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGroup = async (values: z.infer<typeof joinGroupSchema>) => {
    if (!userProfile) return;
    setIsJoining(true);
    try {
      await joinGroup(values.joinCode, userProfile);
      toast({ title: 'Joined group!', description: 'Welcome to the team.' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      console.error(error);
    } finally {
      setIsJoining(false);
    }
  };

  if (authLoading || !userProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Join OLTECH Group</h1>
          <p className="text-muted-foreground">Create a new group or join an existing one with a code.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Group</CardTitle>
              <CardDescription>Start a new workspace for your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateGroup)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="groupName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Q4 Project Team" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Group
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Join an Existing Group</CardTitle>
              <CardDescription>Enter a 6-character code to join.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...joinForm}>
                <form onSubmit={joinForm.handleSubmit(handleJoinGroup)} className="space-y-4">
                  <FormField
                    control={joinForm.control}
                    name="joinCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Join Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDEF"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button variant="secondary" type="submit" className="w-full" disabled={isJoining}>
                    {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Join Group
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
