import ResumePreview from '@/components/resume/ResumePreview';
import DownloadButton from '@/components/resume/DownloadButton';
import ProximityCard from '@/components/ui/ProximityCard';
import { Metadata } from 'next';

// Mark this page as dynamic to prevent static generation
// This is necessary because ResumePreview uses pdfjs-dist which requires browser APIs
export const dynamic = 'force-dynamic';

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <ProximityCard className="neu-surface p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
                <span className="neu-text-gradient">Resume</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-neu-text-secondary">
                Full-Stack Developer | Rochester Institute of Technology
              </p>
            </ProximityCard>
          </div>
        </div>

        {/* Resume Preview Section */}
        <div className="mb-8">
          <ResumePreview pdfUrl="/luke-edwards-resume.pdf" />
        </div>

        {/* Download Button (All Devices) */}
        <div className="flex justify-center">
          <DownloadButton />
        </div>
      </div>
    </main>
  );
}
