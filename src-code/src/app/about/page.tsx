import { About } from "@/components/sections";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Portfolio',
  description: 'Learn more about my background, skills, and experience as a full-stack developer.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background decoration */}
     <div className="absolute inset-0 z-0 pointer-events-none"></div>
      
      <div className="relative z-10">
        <About />
      </div>
    </main>
  );
}