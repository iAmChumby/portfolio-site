import { Now } from "@/components/sections";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Now - Portfolio',
  description: 'What I am currently working on, playing, and listening to.',
};

export default function NowPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none"></div>

      <div className="relative z-10">
        <Now />
      </div>
    </main>
  );
}
