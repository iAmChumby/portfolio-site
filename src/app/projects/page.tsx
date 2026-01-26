import { Projects, Technologies } from "@/components/sections";
import SectionDivider from '@/components/ui/SectionDivider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore Luke Edwards\' portfolio of web development projects including React, Next.js, and full-stack applications. View technical skills and project details.',
  openGraph: {
    title: 'Projects by Luke Edwards | Web Development Portfolio',
    description: 'Explore Luke Edwards\' portfolio of web development projects and technical skills.',
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      <div className="relative z-10">
        <Projects />
        <Technologies />
      </div>
    </main>
  );
}