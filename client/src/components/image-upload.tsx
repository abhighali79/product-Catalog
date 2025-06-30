import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";

interface ImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    setUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: auth.getAuthHeader(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange([...value, ...data.imageUrls]);
      
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [value, onChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || uploading) return;
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [disabled, uploading, handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFileUpload(e.target.files);
  }, [handleFileUpload]);

  const removeImage = useCallback((index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  }, [value, onChange]);

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-slate-600 mb-2">Drag & drop images here, or click to select</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="imageUpload"
          disabled={disabled || uploading}
        />
        <Button
          type="button"
          onClick={() => document.getElementById('imageUpload')?.click()}
          disabled={disabled || uploading}
          variant="outline"
        >
          {uploading ? "Uploading..." : "Choose Images"}
        </Button>
        <p className="text-xs text-slate-500 mt-2">Support: JPG, PNG, WebP (Max 5MB each)</p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
