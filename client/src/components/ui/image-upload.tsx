import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
    placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    className,
    placeholder = "Click to upload image"
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
            return;
        }

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Error", description: "File size should be less than 5MB", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onChange(data.url);
            toast({ title: "Success", description: "Image uploaded successfully" });
        } catch (error) {
            console.error('Upload error:', error);
            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
        } finally {
            setIsUploading(false);
            // Reset input
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await uploadFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {!value ? (
                <div
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-muted/30 hover:bg-muted/50",
                        dragActive ? "border-primary bg-primary/5" : "border-border",
                        isUploading && "pointer-events-none opacity-50"
                    )}
                    onClick={() => inputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    ) : (
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    )}
                    <p className="text-sm text-muted-foreground font-medium text-center px-4">
                        {isUploading ? "Uploading..." : placeholder}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Or drag and drop (Max 5MB)
                    </p>
                </div>
            ) : (
                <div className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                        >
                            Change
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => onChange('')}
                        >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                        </Button>
                    </div>
                </div>
            )}

            {/* Fallback URL input */}
            <div className="flex gap-2">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Or enter image URL directly"
                    className="text-xs font-mono"
                />
            </div>
        </div>
    );
};
