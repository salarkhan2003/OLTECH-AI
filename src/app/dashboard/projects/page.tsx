'use client';

import * as React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Briefcase } from "lucide-react";
import { useGroup } from '@/components/group-provider';
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog';
import { format } from 'date-fns';
import type { Project } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusVariant: { [key in Project['status']]: "default" | "secondary" | "destructive" | "outline" } = {
  'Completed': 'default',
  'On Track': 'secondary',
  'Off Track': 'outline',
  'At Risk': 'destructive',
};

const statusColor: { [key in Project['status']]: string } = {
    'Completed': 'bg-green-500',
    'On Track': 'bg-blue-500',
    'Off Track': 'bg-gray-500',
    'At Risk': 'bg-yellow-500',
};


export default function ProjectsPage() {
    const { projects } = useGroup();
    const [open, setOpen] = React.useState(false);

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your team's projects and milestones.</p>
                </div>
                <Button onClick={() => setOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            <CreateProjectDialog open={open} onOpenChange={setOpen} />

            <Card>
                <CardContent className="pt-6">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center h-96 bg-secondary/30 rounded-lg">
                            <Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <h3 className="font-semibold text-xl">No Projects Yet</h3>
                            <p className="text-sm text-muted-foreground mt-2">Create your first project to get started.</p>
                             <Button onClick={() => setOpen(true)} className="mt-4">
                                <PlusCircle className="mr-2 h-4 w-4" /> New Project
                            </Button>
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">{project.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[project.status]}>
                                            <span className={`mr-2 h-2 w-2 rounded-full ${statusColor[project.status]}`} />
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {project.dueDate ? format(project.dueDate.toDate(), 'MMM d, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
