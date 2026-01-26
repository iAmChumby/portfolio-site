import { Hero } from "@/components/sections";
import { Metadata } from 'next';
import AnimatedBackgroundWrapper from '@/components/ui/AnimatedBackground';

export const metadata: Metadata = {
  title: 'Portfolio - Full Stack Developer',
  description: 'Welcome to my portfolio. I create beautiful, functional, and user-centered digital experiences.',
};

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="relative z-10">
        <Hero />
      </div>
    </main>
  );
}
