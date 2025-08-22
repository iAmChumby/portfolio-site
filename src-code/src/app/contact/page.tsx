import { Contact } from "@/components/sections";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Portfolio',
  description: 'Get in touch with me for collaboration opportunities or project inquiries.',
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