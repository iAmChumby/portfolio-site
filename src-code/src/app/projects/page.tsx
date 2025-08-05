import { Projects, Technologies } from "@/components/sections";
import SectionDivider from '@/components/ui/SectionDivider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - Portfolio',
  description: 'Explore my portfolio of web development projects and technical skills.',
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <Technologies />
        <SectionDivider variant="gradient" />
        <Projects />
      </div>
    </main>
  );
}