'use client';

import { useState } from 'react';

interface PDFViewerProps {
  fileUrl: string;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError('Failed to load PDF. Please try downloading instead.');
    setLoading(false);
  };

  if (error) {
    return (
      <div className="neu-surface p-8 rounded-neu-lg shadow-neu-outset text-center">
        <p className="text-neu-text-secondary mb-4">{error}</p>
        <a
          href={fileUrl}
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
      {/* PDF Document Container */}
      <div className="bg-neu-bg-base border border-neu-bg-lighter rounded-neu-lg overflow-hidden relative">
        {loading && (
          <div className="flex items-center justify-center p-12 absolute inset-0 bg-neu-bg-base z-10">
            <div className="animate-pulse space-y-4 w-full max-w-2xl">
              <div className="h-8 bg-neu-bg-lighter rounded"></div>
              <div className="h-96 bg-neu-bg-lighter rounded"></div>
              <div className="h-8 bg-neu-bg-lighter rounded"></div>
            </div>
          </div>
        )}

        {/* PDF iframe viewer */}
        <iframe
          src={`${fileUrl}#view=FitH`}
          className="w-full h-[800px] border-0"
          title="Resume PDF"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
}
