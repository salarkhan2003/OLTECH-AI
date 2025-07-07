import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const teamMembers = [
  { name: 'Alice Johnson', email: 'alice@oltech.ai', role: 'Admin', status: 'Active', avatar: 'https://placehold.co/40x40/png' },
  { name: 'Bob Williams', email: 'bob@oltech.ai', role: 'Manager', status: 'Active', avatar: 'https://placehold.co/40x40/png' },
  { name: 'Charlie Brown', email: 'charlie@oltech.ai', role: 'Developer', status: 'Active', avatar: 'https://placehold.co/40x40/png' },
  { name: 'David Miller', email: 'david@oltech.ai', role: 'Developer', status: 'Invited', avatar: 'https://placehold.co/40x40/png' },
  { name: 'Eve Davis', email: 'eve@oltech.ai', role: 'Viewer', status: 'Active', avatar: 'https://placehold.co/40x40/png' },
  { name: 'Frank Garcia', email: 'frank@oltech.ai', role: 'Developer', status: 'Inactive', avatar: 'https://placehold.co/40x40/png' },
];

const roleVariant: { [key: string]: "default" | "secondary" | "outline" } = {
  'Admin': 'default',
  'Manager': 'secondary',
  'Developer': 'outline',
  'Viewer': 'outline',
};

const statusVariant: { [key: string]: string } = {
  'Active': 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20',
  'Invited': 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20',
  'Inactive': 'bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/20',
};

export default function TeamPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team and their roles.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleVariant[member.role] || 'outline'}>{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusVariant[member.status]}>{member.status}</Badge>
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
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>View Activity</DropdownMenuItem>
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
