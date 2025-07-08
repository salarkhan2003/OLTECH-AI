'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, UserPlus, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGroup } from "@/components/group-provider";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const roleVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'admin': 'default',
  'member': 'secondary',
};

export default function TeamPage() {
  const { group, members } = useGroup();
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
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team and their roles.</p>
        </div>
        <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground hidden sm:block">
                Join Code: <span className="font-semibold text-foreground">{group?.joinCode}</span>
            </p>
            <Button variant="outline" size="sm" onClick={copyJoinCode}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Member</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
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
                  <TableCell>
                    <Badge variant={roleVariant[member.role] || 'outline'} className="capitalize">{member.role}</Badge>
                  </TableCell>
                   <TableCell className="text-muted-foreground">
                     {member.joinedAt ? format(member.joinedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Remove from Team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
