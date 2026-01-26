import { Contact } from "@/components/sections";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Luke Edwards for collaboration opportunities, freelance projects, or full-time positions. Available for hire in Utica, New York.',
  openGraph: {
    title: 'Contact Luke Edwards | Hire a Full Stack Developer',
    description: 'Get in touch with Luke Edwards for collaboration opportunities or project inquiries.',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      <div className="relative z-10">
        <Contact />
      </div>
    </main>
  );
}