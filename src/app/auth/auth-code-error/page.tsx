'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse error from URL hash (Supabase puts errors in the hash)
  const hashParams = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.hash.slice(1))
    : null;
  
  const error = hashParams?.get('error') || searchParams.get('error') || 'unknown_error';
  const errorCode = hashParams?.get('error_code') || searchParams.get('error_code');
  const errorDescription = hashParams?.get('error_description') || searchParams.get('error_description');

  const getErrorMessage = () => {
    if (errorDescription?.includes('user profile')) {
      return (
        <>
          <p className="text-gray-400 mb-4">
            GitHub authentication succeeded, but we couldn&apos;t fetch your profile data.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            This usually happens when the GitHub OAuth app needs additional permissions. 
            Please try signing in again - the issue may be temporary.
          </p>
        </>
      );
    }
    
    return (
      <p className="text-gray-400 mb-8">
        There was an issue completing the authentication process. 
        {errorDescription && (
          <span className="block mt-2 text-sm text-gray-500">
            Details: {decodeURIComponent(errorDescription.replace(/\+/g, ' '))}
          </span>
        )}
      </p>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-red-900/20 border border-red-800/50">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-4">
          Authentication Error
        </h1>

        {getErrorMessage()}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-accent hover:bg-purple-glow text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-card-border text-gray-400 hover:text-foreground font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {errorCode && (
          <p className="mt-6 text-xs text-gray-600">
            Error code: {errorCode}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
