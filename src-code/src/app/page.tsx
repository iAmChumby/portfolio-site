import { Hero } from "@/components/sections";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Full Stack Developer',
  description: 'Welcome to my portfolio. I create beautiful, functional, and user-centered digital experiences.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  );
}
