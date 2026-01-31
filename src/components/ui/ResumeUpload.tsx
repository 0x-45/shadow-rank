'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, Loader2, AlertCircle } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  onSkip?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ResumeUpload({
  onUpload,
  onSkip,
  isLoading = false,
  error = null,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging
            ? 'border-purple-accent bg-purple-accent/10'
            : 'border-card-border hover:border-purple-accent/50'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <div className="text-center">
          {selectedFile ? (
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="w-12 h-12 text-purple-accent" />
                <div className="text-left">
                  <p className="text-foreground font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-1 rounded-full hover:bg-card-border transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Drop your resume here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse (PDF only)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-800/50 flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="w-full py-3 px-4 bg-purple-accent hover:bg-purple-glow text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Begin Awakening
            </>
          )}
        </button>

        {onSkip && (
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="w-full py-3 px-4 text-gray-400 hover:text-foreground font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Use GitHub Profile Instead
          </button>
        )}
      </div>
    </div>
  );
}
