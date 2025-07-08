'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useGroup } from '../group-provider';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const { group } = useGroup();
  const { toast } = useToast();

  const copyJoinCode = () => {
    if (!group?.joinCode) return;
    navigator.clipboard.writeText(group.joinCode);
    toast({
      title: "Copied to clipboard!",
      description: `Join code ${group.joinCode} is ready to be shared.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a Team Member</DialogTitle>
          <DialogDescription>
            Share this join code with the person you want to invite. They can use it to join your group.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
            <div className="grid flex-1 gap-2">
                <Input
                    id="link"
                    defaultValue={group?.joinCode}
                    readOnly
                    className="font-mono text-center text-lg h-12"
                />
            </div>
            <Button type="submit" size="icon" className="h-12 w-12" onClick={copyJoinCode}>
                <Copy className="h-6 w-6" />
            </Button>
        </div>
        <DialogFooter className="sm:justify-start">
            <p className="text-xs text-muted-foreground">
                Sending email invites directly is coming soon.
            </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
