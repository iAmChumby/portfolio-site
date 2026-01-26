import { Projects, Technologies } from "@/components/sections";
import SectionDivider from '@/components/ui/SectionDivider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - Portfolio',
  description: 'Explore my portfolio of web development projects and technical skills.',
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      <div className="relative z-10">
        <Projects />
        <SectionDivider variant="gradient" />
        <Technologies />
      </div>
    </main>
  );
}