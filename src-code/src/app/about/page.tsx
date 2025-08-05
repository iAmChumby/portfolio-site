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
      <div className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-accent/10 rounded-full blur-sm animate-pulse -z-20"></div>
      <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-sm animate-pulse delay-1000 -z-20"></div>
      
      <div className="relative z-10">
        <About />
      </div>
    </main>
  );
}