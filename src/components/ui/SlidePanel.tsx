'use client';

import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * SlidePanel - A reusable slide-in panel component
 * 
 * Features:
 * - Slides in from the right side
 * - 75% viewport width
 * - Dark overlay on remaining 25% (click to dismiss)
 * - Close button (X) in header
 * - Escape key to close
 * - Smooth animations
 */
export default function SlidePanel({ 
  isOpen, 
  onClose, 
  title,
  children 
}: SlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Add/remove event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap - focus the panel when it opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Slide panel'}
        className={`
          fixed top-0 right-0 z-50 h-full w-[75vw]
          bg-background border-l border-card-border
          shadow-2xl shadow-black/50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
          outline-none
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-card-border bg-card-bg">
          {title && (
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="
              ml-auto p-2 rounded-lg
              text-muted hover:text-foreground
              hover:bg-card-border/50
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-accent
            "
            aria-label="Close panel"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
