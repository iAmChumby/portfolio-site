'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function DownloadButton() {
  return (
    <a
      href="/luke-edwards-resume.pdf"
      download="Luke-Edwards-Resume.pdf"
      className="inline-flex items-center gap-3 px-6 py-3 neu-surface shadow-neu-outset
                 hover:shadow-neu-pressed rounded-neu-md transition-all duration-200
                 text-neu-text-primary font-medium group"
    >
      <ArrowDownTrayIcon className="w-5 h-5 text-neu-accent group-hover:scale-110 transition-transform duration-200" />
      <span>Download Resume</span>
    </a>
  );
}
