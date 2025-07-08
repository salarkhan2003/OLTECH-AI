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
  FormLabel,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useGroup } from '../group-provider';
import { updateMemberRole } from '@/lib/db';
import type { GroupMember } from '@/lib/types';

const changeRoleSchema = z.object({
  role: z.enum(['admin', 'member']),
});

type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

interface ChangeRoleDialogProps {
  member: GroupMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeRoleDialog({ member, open, onOpenChange }: ChangeRoleDialogProps) {
  const { group } = useGroup();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: member.role,
    },
  });

  async function onSubmit(data: ChangeRoleFormValues) {
    if (!group) return;
    setIsLoading(true);

    try {
      await updateMemberRole(group.id, member.uid, data.role);
      toast({
        title: 'Role Updated',
        description: `${member.displayName}'s role has been changed to ${data.role}.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the member\'s role. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (open) {
      form.reset({ role: member.role });
    }
  }, [open, member, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Change the role for <span className="font-semibold">{member.displayName}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="change-role-form" className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="change-role-form" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
