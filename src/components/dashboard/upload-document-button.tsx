'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2 } from "lucide-react";
import { useGroup } from '../group-provider';
import { useAuth } from '../auth-provider';
import { useToast } from '@/hooks/use-toast';
import { uploadDocument } from '@/lib/db';

export function UploadDocumentButton() {
    const { group } = useGroup();
    const { userProfile } = useAuth();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !group || !userProfile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            await uploadDocument(group.id, file, userProfile, (progress) => {
                setUploadProgress(progress);
            });
            toast({
                title: "Upload complete!",
                description: `"${file.name}" has been added to your documents.`,
            });
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                variant: 'destructive',
                title: "Upload Failed",
                description: "Could not upload the document. Please try again.",
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Document
            </Button>
            {isUploading && (
                <div className="w-32">
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}
        </div>
    );
}
