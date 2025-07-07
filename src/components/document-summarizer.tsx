'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { summarizeDocumentAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, FileUp, Loader2 } from 'lucide-react';

export default function DocumentSummarizer() {
  const [file, setFile] = React.useState<File | null>(null);
  const [summary, setSummary] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSummary('');
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a document to summarize.',
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (loadEvent) => {
        const documentDataUri = loadEvent.target?.result as string;

        if (!documentDataUri) {
          throw new Error('Could not read file.');
        }

        const result = await summarizeDocumentAction({ documentDataUri });

        if (result.success && result.data) {
          setSummary(result.data.summary);
          toast({
            title: 'Summary Generated',
            description: 'The document has been successfully summarized.',
          });
        } else {
          throw new Error(result.error || 'An unknown error occurred.');
        }
      };
      reader.onerror = () => {
        throw new Error('Failed to read file for summarization.');
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: errorMessage,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Document Summarizer
        </CardTitle>
        <CardDescription>Upload a document and get a concise summary powered by AI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-upload">Upload Document</Label>
          <div className="flex items-center gap-2">
            <Input id="document-upload" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
             <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full justify-start text-left font-normal">
              <FileUp className="mr-2 h-4 w-4" />
              {file ? file.name : 'Choose a file'}
            </Button>
          </div>
        </div>
        <Button onClick={handleSummarize} disabled={isLoading || !file} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Summarizing...' : 'Generate Summary'}
        </Button>
        {summary && (
          <div className="p-4 bg-secondary/50 rounded-lg border space-y-2">
            <h4 className="font-semibold">Summary:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
