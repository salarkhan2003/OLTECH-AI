
'use client';
import * as React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, UserPlus, Trash2, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useGroup } from "@/components/group-provider";
import { useAuth } from '@/components/auth-provider';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import type { GroupMember } from '@/lib/types';
import { removeMemberFromGroup } from '@/lib/db';
import { ChangeRoleDialog } from '@/components/dashboard/change-role-dialog';
import { InviteMemberDialog } from '@/components/dashboard/invite-member-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const roleVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'admin': 'default',
  'member': 'secondary',
};

export default function TeamPage() {
  const { group, members } = useGroup();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [memberToRemove, setMemberToRemove] = React.useState<GroupMember | null>(null);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [memberToChangeRole, setMemberToChangeRole] = React.useState<GroupMember | null>(null);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = React.useState(false);
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  
  const isCurrentUserAdmin = React.useMemo(() => {
    if (!userProfile || !members) return false;
    const currentUserMemberInfo = members.find(m => m.uid === userProfile.uid);
    return currentUserMemberInfo?.role === 'admin';
  }, [userProfile, members]);

  const handleRemoveMember = async () => {
    if (!memberToRemove || !group) return;
    setIsRemoving(true);
    try {
      await removeMemberFromGroup(group.id, memberToRemove.uid);
      toast({ title: "Member removed", description: `${memberToRemove.displayName} has been removed from the group.` });
    } catch(e) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: "Failed to remove member." });
    } finally {
      setIsRemoving(false);
      setMemberToRemove(null);
    }
  };

  const handleChangeRoleClick = (member: GroupMember) => {
    setMemberToChangeRole(member);
    setIsChangeRoleOpen(true);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team and their roles.</p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>
      
      <InviteMemberDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />

      {memberToChangeRole && (
        <ChangeRoleDialog
          member={memberToChangeRole}
          open={isChangeRoleOpen}
          onOpenChange={(open) => {
            if (!open) setMemberToChangeRole(null);
            setIsChangeRoleOpen(open);
          }}
        />
      )}

      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <span className="font-bold">{memberToRemove?.displayName}</span> from the group. They will need a new invite code to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} disabled={isRemoving}>
              {isRemoving ? "Removing..." : "Remove Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Member</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const isSelf = member.uid === userProfile?.uid;
                const admins = members.filter(m => m.role === 'admin');
                const isLastAdmin = admins.length === 1 && admins[0].uid === member.uid;

                const actionButtonDisabled = !isCurrentUserAdmin || isSelf;

                return (
                  <TableRow key={member.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.photoURL ?? ''} alt={member.displayName ?? ''} />
                          <AvatarFallback>{member.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.displayName}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.title || 'Not set'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.department || 'Not set'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[member.role] || 'outline'} className="capitalize">{member.role}</Badge>
                    </TableCell>
                     <TableCell className="text-muted-foreground">
                       {member.joinedAt ? format(member.joinedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span tabIndex={actionButtonDisabled ? 0 : -1}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={actionButtonDisabled}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleChangeRoleClick(member)} disabled={isLastAdmin}>
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  <span>Change Role</span>
                                  {isLastAdmin && <Badge variant="outline" className="ml-2">Last Admin</Badge>}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => setMemberToRemove(member)} disabled={isLastAdmin}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Remove from Team</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </span>
                        </TooltipTrigger>
                        {isSelf && (
                          <TooltipContent>
                            <p>You cannot perform actions on yourself.</p>
                          </TooltipContent>
                        )}
                        {!isCurrentUserAdmin && (
                           <TooltipContent>
                            <p>Only admins can perform this action.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
