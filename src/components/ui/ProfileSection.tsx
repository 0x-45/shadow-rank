'use client';

import { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  ExternalLink, 
  Calendar, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import type { User } from '@/types';

interface ProfileSectionProps {
  user: User;
  onResumeUploaded?: (url: string) => void;
}

/**
 * ProfileSection - Displays user profile info, resume, and goal
 */
export default function ProfileSection({ user, onResumeUploaded }: ProfileSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload resume');
      }

      setUploadSuccess(true);
      if (onResumeUploaded && result.data?.url) {
        onResumeUploaded(result.data.url);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-card-bg border border-card-border">
      <h2 className="text-xl font-semibold text-foreground mb-4">Profile</h2>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-card-border">
        {user.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={user.avatar_url} 
            alt={user.username}
            className="w-16 h-16 rounded-full border-2 border-purple-accent"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold text-foreground">{user.username}</h3>
          <p className="text-sm text-muted">@{user.github_id || user.username}</p>
        </div>
      </div>

      {/* Resume Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Resume</h3>
          {user.resume_url && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Uploaded
            </span>
          )}
        </div>

        {/* Current Resume */}
        {user.resume_url ? (
          <div className="p-4 rounded-xl bg-background border border-card-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-dark/30">
                <FileText className="w-5 h-5 text-purple-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">resume</p>
                {user.resume_uploaded_at && (
                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Uploaded {formatDate(user.resume_uploaded_at)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={user.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-card-border transition-colors text-muted hover:text-foreground"
                  title="View resume"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={user.resume_url}
                  download
                  className="p-2 rounded-lg hover:bg-card-border transition-colors text-muted hover:text-foreground"
                  title="Download resume"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-background border border-dashed border-card-border text-center">
            <FileText className="w-8 h-8 text-muted mx-auto mb-2" />
            <p className="text-sm text-muted">No resume uploaded yet</p>
          </div>
        )}

        {/* Upload Button */}
        <label className="block">
          <input
            type="file"
            accept=".pdf,.txt,.md,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
          <div
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              border border-dashed border-card-border
              cursor-pointer transition-colors
              ${isUploading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-card-border/30 hover:border-purple-accent'
              }
            `}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-accent" />
                <span className="text-sm text-muted">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-purple-accent" />
                <span className="text-sm text-foreground">
                  {user.resume_url ? 'Update Resume' : 'Upload Resume'}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted text-center mt-2">
            Supported: PDF, TXT, MD, DOC, DOCX (max 10MB)
          </p>
        </label>

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-800/50">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{uploadError}</p>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-900/20 border border-green-800/50">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-400">Resume uploaded successfully!</p>
          </div>
        )}
      </div>

      {/* Goal Section - Placeholder for Task 8.0 */}
      {user.goal && (
        <div className="mt-6 pt-4 border-t border-card-border">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">Career Goal</h3>
          <p className="text-foreground">{user.goal}</p>
        </div>
      )}
    </div>
  );
}
