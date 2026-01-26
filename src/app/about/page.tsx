import { About } from "@/components/sections";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Luke Edwards - a full-stack developer with expertise in React, Node.js, Python, and modern web technologies. Based in Utica, New York.',
  openGraph: {
    title: 'About Luke Edwards | Full Stack Developer',
    description: 'Learn about Luke Edwards - a full-stack developer with expertise in React, Node.js, Python, and modern web technologies.',
  },
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