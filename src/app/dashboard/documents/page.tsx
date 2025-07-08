'use client';

import * as React from 'react';
import { useGroup } from '@/components/group-provider';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Folder, MoreHorizontal, Download, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { UploadDocumentButton } from '@/components/dashboard/upload-document-button';
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

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function DocumentsPage() {
  const { group, documents } = useGroup();
  const { toast } = useToast();
  const [docToDelete, setDocToDelete] = React.useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
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
        <UploadDocumentButton />
      </div>
      
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

       <Card>
        <CardContent className="pt-6">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-96 bg-secondary/30 rounded-lg">
                <Folder className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-xl">No Documents Uploaded</h3>
                <p className="text-sm text-muted-foreground mt-2">Upload your first document to see it here.</p>
                 <div className="mt-4">
                   <UploadDocumentButton />
                 </div>
            </div>
          ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Uploaded by</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
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
