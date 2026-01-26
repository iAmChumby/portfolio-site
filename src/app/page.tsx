import { Hero } from "@/components/sections";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luke Edwards - Full Stack Developer & Designer',
  description: 'Luke Edwards is a passionate full-stack developer creating beautiful, functional, and user-centered digital experiences with React, Next.js, and modern web technologies.',
  openGraph: {
    title: 'Luke Edwards - Full Stack Developer & Designer',
    description: 'Passionate full-stack developer creating beautiful, functional, and user-centered digital experiences.',
  },
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
