import PDFViewer from '@/components/resume/PDFViewer';
import DownloadButton from '@/components/resume/DownloadButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'View and download Luke Edwards\' resume - Full-Stack Developer with expertise in React, Next.js, Python, and modern web technologies.',
  openGraph: {
    title: 'Resume | Luke Edwards - Full Stack Developer',
    description: 'View and download Luke Edwards\' resume showcasing experience and projects.',
  },
};

export default function ResumePage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neu-text-gradient mb-4">Resume</h1>
          <p className="text-neu-text-secondary text-lg">
            Full-Stack Developer | Rochester Institute of Technology
          </p>
        </div>

        {/* PDF Viewer Section (Desktop/Tablet) */}
        <div className="hidden sm:block mb-8">
          <PDFViewer fileUrl="/luke-edwards-resume.pdf" />
        </div>

        {/* Mobile Message */}
        <div className="sm:hidden mb-8 neu-surface p-6 rounded-neu-lg shadow-neu-outset text-center">
          <p className="text-neu-text-secondary">
            For the best viewing experience, download the resume or view on a larger screen.
          </p>
        </div>

        {/* Download Button (All Devices) */}
        <div className="flex justify-center">
          <DownloadButton />
        </div>
      </div>
    </main>
  );
}
