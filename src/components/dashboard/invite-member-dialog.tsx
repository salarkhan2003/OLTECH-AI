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
import { Copy, Link2 } from 'lucide-react';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const { group } = useGroup();
  const { toast } = useToast();
  const [inviteLink, setInviteLink] = React.useState('');

  React.useEffect(() => {
    if (group?.joinCode) {
        // window.location.origin is only available on the client
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setInviteLink(`${origin}/join?code=${group.joinCode}`);
    }
  }, [group?.joinCode]);

  const copyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Copied to clipboard!",
      description: `Your invite link is ready to be shared.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a Team Member</DialogTitle>
          <DialogDescription>
            Share this link with people you want to invite. They will automatically join your group after signing up or logging in.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
            <div className="grid flex-1 gap-2">
                <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="link"
                        value={inviteLink}
                        readOnly
                        className="pl-9"
                    />
                </div>
            </div>
            <Button type="submit" size="icon" onClick={copyInviteLink} disabled={!inviteLink}>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
        <DialogFooter className="sm:justify-start">
             <p className="text-xs text-muted-foreground">This link does not expire, but you can generate a new one from Settings.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
