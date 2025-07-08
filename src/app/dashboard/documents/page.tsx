'use client';

import * as React from 'react';
import { useGroup } from '@/components/group-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Folder, MoreHorizontal, Download, Trash2, Upload, Link as LinkIcon, Briefcase } from "lucide-react";
import { format } from 'date-fns';
import { UploadDocumentDialog } from '@/components/dashboard/upload-document-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { deleteDocument } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import type { Document } from '@/lib/types';
import Link from 'next/link';

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function DocumentsPage() {
  const { group, documents, tasks, projects } = useGroup();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [docToDelete, setDocToDelete] = React.useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');

  const myTaskIds = React.useMemo(() => new Set(
    tasks.filter(t => t.assignedTo === userProfile?.uid).map(t => t.id)
  ), [tasks, userProfile]);

  const filteredDocuments = React.useMemo(() => {
    if (activeTab === 'my_tasks') {
      return documents.filter(doc => doc.taskId && myTaskIds.has(doc.taskId));
    }
    return documents;
  }, [documents, activeTab, myTaskIds]);

  const projectsMap = React.useMemo(() => new Map(projects.map(p => [p.id, p.name])), [projects]);
  const tasksMap = React.useMemo(() => new Map(tasks.map(t => [t.id, t.title])), [tasks]);

  const handleDelete = async () => {
    if (!docToDelete || !group) return;
    
    setIsDeleting(true);
    try {
      await deleteDocument(group.id, docToDelete);
      toast({ title: "Document deleted", description: `"${docToDelete.name}" has been removed.`});
    } catch(e) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: "Failed to delete document."});
    } finally {
      setIsDeleting(false);
      setDocToDelete(null);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage your project documents.</p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      <UploadDocumentDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />
      
      <AlertDialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              <span className="font-bold"> {docToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="my_tasks">Linked to My Tasks</TabsTrigger>
        </TabsList>
      </Tabs>

       <Card>
        <CardContent className="pt-6">
          {filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-96 bg-secondary/30 rounded-lg">
                <Folder className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-xl">No Documents Found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {activeTab === 'all' ? 'Upload your first document to see it here.' : "No documents are linked to your tasks."}
                </p>
                 <div className="mt-4">
                   <Button onClick={() => setIsUploadDialogOpen(true)}>
                     <Upload className="mr-2 h-4 w-4" />
                     Upload Document
                   </Button>
                 </div>
            </div>
          ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Linked To</TableHead>
                        <TableHead>Uploaded by</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
                            <TableCell className="text-muted-foreground max-w-xs truncate" title={doc.description}>
                              {doc.description || '-'}
                            </TableCell>
                            <TableCell>
                              {doc.projectId || doc.taskId ? (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                  {doc.projectId && <Briefcase className="h-4 w-4" />}
                                  {doc.taskId && !doc.projectId && <LinkIcon className="h-4 w-4" />}
                                  <span className="truncate">{projectsMap.get(doc.projectId!) || tasksMap.get(doc.taskId!)}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={doc.uploaderPhotoURL ?? ''} />
                                        <AvatarFallback>{doc.uploaderName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">{doc.uploaderName}</span>
                                </div>
                            </TableCell>
                            <TableCell>{formatBytes(doc.size)}</TableCell>
                            <TableCell>{doc.uploadedAt ? format(doc.uploadedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" download={doc.name}>
                                                <Download className="mr-2 h-4 w-4" />
                                                <span>Download</span>
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDocToDelete(doc)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
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
