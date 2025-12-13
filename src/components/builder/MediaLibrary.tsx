'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/actions/upload';

type UploadedFile = {
  url: string;
  filename: string;
};

type MediaLibraryProps = {
  onSelect?: (url: string) => void;
  existingFiles?: Array<{
    id: string;
    url: string;
    filename: string;
    uploadedAt: Date;
  }>;
};

export function MediaLibrary({ onSelect, existingFiles = [] }: MediaLibraryProps) {
  const [uploading, setUploading] = useState(false);
  const [_uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadFile(formData);
      setUploadedFile(result);
      
      if (onSelect) {
        onSelect(result.url);
      }
      
      // Refresh the page to show new file
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (url: string) => {
    setSelectedUrl(url);
    if (onSelect) {
      onSelect(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>

        {error && (
            <div className="mt-2 text-xs text-red-500 bg-red-500/10 p-2 rounded flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
            </div>
        )}
      </div>

      {/* File Grid */}
      {existingFiles.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {existingFiles.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => handleSelect(file.url)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedUrl === file.url
                  ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img
                src={file.url}
                alt={file.filename}
                className="w-full h-full object-cover"
              />
              {selectedUrl === file.url && (
                <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No images uploaded yet</p>
          <p className="text-xs text-slate-500 mt-1">Upload your first image above</p>
        </div>
      )}
    </div>
  );
}
