import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FileText, FileImage, FileVideo, Upload } from "lucide-react";
import DocumentSummarizer from "@/components/document-summarizer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const documents = [
  { name: 'Project Brief - Website Redesign.pdf', type: 'PDF', size: '2.3 MB', uploadedBy: 'Alice', date: '2024-10-15', category: 'Brief' },
  { name: 'User Persona - Marketing.docx', type: 'Word', size: '850 KB', uploadedBy: 'Bob', date: '2024-10-12', category: 'Research' },
  { name: 'Q4 Financial Projections.xlsx', type: 'Excel', size: '1.1 MB', uploadedBy: 'Charlie', date: '2024-10-10', category: 'Finance' },
  { name: 'Launch Presentation.pptx', type: 'PPT', size: '5.8 MB', uploadedBy: 'Alice', date: '2024-10-08', category: 'Presentation' },
  { name: 'logo_final_v3.png', type: 'Image', size: '450 KB', uploadedBy: 'David', date: '2024-10-05', category: 'Assets' },
  { name: 'Demo Video.mp4', type: 'Video', size: '25.6 MB', uploadedBy: 'Eve', date: '2024-10-02', category: 'Media' },
];

const fileIcons: { [key: string]: React.ReactNode } = {
  'PDF': <FileText className="h-5 w-5 text-red-500" />,
  'Word': <FileText className="h-5 w-5 text-blue-500" />,
  'Excel': <FileText className="h-5 w-5 text-green-500" />,
  'PPT': <FileText className="h-5 w-5 text-orange-500" />,
  'Image': <FileImage className="h-5 w-5 text-purple-500" />,
  'Video': <FileVideo className="h-5 w-5 text-indigo-500" />,
};

export default function DocumentsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage and summarize your project documents.</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {fileIcons[doc.type] || <FileText className="h-5 w-5" />}
                          <span>{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.uploadedBy}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem>Summarize with AI</DropdownMenuItem>
                            <DropdownMenuItem>Move</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <DocumentSummarizer />
        </div>
      </div>
    </main>
  );
}
