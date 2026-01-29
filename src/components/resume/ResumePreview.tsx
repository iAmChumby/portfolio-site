'use client';

import { useState, useEffect } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface ResumePreviewProps {
  pdfUrl: string;
}

export default function ResumePreview({ pdfUrl }: ResumePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch preview image from API route
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/resume/preview');
        if (!response.ok) {
          throw new Error('Failed to load preview');
        }

        // Convert response to blob URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err) {
        console.error('Error loading resume preview:', err);
        setError('Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();

    // Cleanup blob URL on unmount
    return () => {
      // Cleanup will happen in a separate effect that watches previewUrl
    };
  }, []);

  // Cleanup blob URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleOpenPDF = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  if (error) {
    // Fallback: show download button if preview fails
    return (
      <div className="neu-surface p-8 rounded-neu-lg shadow-neu-outset text-center">
        <p className="text-neu-text-secondary mb-4">
          Preview unavailable. Please download the resume to view it.
        </p>
        <a
          href={pdfUrl}
          download="Luke-Edwards-Resume.pdf"
          className="text-neu-accent hover:underline"
        >
          Download Resume PDF
        </a>
      </div>
    );
  }

  return (
    <div className="neu-surface rounded-neu-lg shadow-neu-outset-lg overflow-hidden">
      {/* Preview Image Container */}
      <div className="bg-neu-bg-base overflow-hidden relative">
        {loading && (
          <div className="flex items-center justify-center p-12 absolute inset-0 bg-neu-bg-base z-10">
            <div className="animate-pulse space-y-4 w-full max-w-2xl">
              <div className="h-8 bg-neu-bg-lighter rounded"></div>
              <div className="h-96 bg-neu-bg-lighter rounded"></div>
              <div className="h-8 bg-neu-bg-lighter rounded"></div>
            </div>
          </div>
        )}

        {previewUrl && !loading && (
          <div className="relative w-full">
            {/* Clickable Preview Image */}
            <button
              onClick={handleOpenPDF}
              className="w-full cursor-pointer hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-neu-accent focus:ring-offset-2 focus:ring-offset-neu-bg-base rounded-t-neu-lg overflow-hidden group"
              aria-label="Open resume PDF in new tab"
            >
              <div className="relative w-full aspect-[8.5/11] bg-white flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview of Luke Edwards' resume"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-neu-accent opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-t-neu-lg" />
              </div>
            </button>

            {/* Open PDF Button */}
            <div className="p-4 bg-neu-bg-base border-t border-neu-bg-lighter">
              <button
                onClick={handleOpenPDF}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 neu-surface shadow-neu-outset hover:shadow-neu-pressed rounded-neu-md transition-all duration-200 text-neu-text-primary font-medium group"
                aria-label="Open resume PDF in new tab"
              >
                <ArrowTopRightOnSquareIcon className="w-5 h-5 text-neu-accent group-hover:scale-110 transition-transform duration-200" />
                <span>Open PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
