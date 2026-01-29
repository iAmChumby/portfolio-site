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
    // Render PDF preview client-side
    const renderPDFPreview = async () => {
      // Only run in browser
      if (typeof window === 'undefined') {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Dynamically import pdfjs-dist only in browser
        const pdfjsLib = await import('pdfjs-dist');
        
        // Configure PDF.js worker - use jsdelivr CDN with correct path
        // For pdfjs-dist 5.x, the worker is at build/pdf.worker.mjs
        const workerVersion = pdfjsLib.version || '5.4.530';
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${workerVersion}/build/pdf.worker.mjs`;

        // Load PDF document from public URL
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        // Get first page
        const page = await pdf.getPage(1);

        // Set scale for high-quality rendering (3x for higher resolution)
        const scale = 3.0;
        const viewport = page.getViewport({ scale });

        // Create canvas element for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        // Convert canvas to image data URL
        const imageUrl = canvas.toDataURL('image/png');
        setPreviewUrl(imageUrl);
      } catch (err) {
        console.error('Error rendering PDF preview:', err);
        setError('Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    renderPDFPreview();
  }, [pdfUrl]);

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
          <div className="relative w-full flex flex-col items-center">
            {/* Clickable Preview Image */}
            <button
              onClick={handleOpenPDF}
              className="w-full max-w-[50%] cursor-pointer hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-neu-accent focus:ring-offset-2 focus:ring-offset-neu-bg-base rounded-neu-lg overflow-hidden group mb-4"
              aria-label="Open resume PDF in new tab"
            >
              <div className="relative w-full aspect-[8.5/11] bg-white flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview of Luke Edwards' resume"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-neu-accent opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-neu-lg" />
              </div>
            </button>

            {/* Open PDF Button - Now below the preview */}
            <div className="w-full max-w-[50%]">
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
