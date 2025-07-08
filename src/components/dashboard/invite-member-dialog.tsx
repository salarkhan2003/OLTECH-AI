
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
import { Copy, Hash } from 'lucide-react';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const { group } = useGroup();
  const { toast } = useToast();
  const joinCode = group?.joinCode || '';

  const copyJoinCode = () => {
    if (!joinCode) return;
    navigator.clipboard.writeText(joinCode);
    toast({
      title: "Copied to clipboard!",
      description: `Your invite code is ready to be shared.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a Team Member</DialogTitle>
          <DialogDescription>
            Share this code with people you want to invite. They can enter it after signing up to join your team.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
            <div className="grid flex-1 gap-2">
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="join-code"
                        value={joinCode}
                        readOnly
                        className="pl-9 font-mono text-lg tracking-widest text-center"
                    />
                </div>
            </div>
            <Button type="button" size="icon" onClick={copyJoinCode} disabled={!joinCode}>
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
        <DialogFooter className="sm:justify-start">
             <p className="text-xs text-muted-foreground">This code does not expire.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
