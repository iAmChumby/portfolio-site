'use client';

import siteConfig from '@/data/site-config.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 relative">
      {/* Gradient blur overlay for better text readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          backdropFilter: 'blur(8px)'
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-bold text-emerald-500">
              {siteConfig.site.author.name}
            </h3>
            <p className="text-base text-white max-w-sm">
              Full-stack developer passionate about creating innovative web solutions and beautiful user experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-emerald-500">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {['About', 'Technologies', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white hover:text-accent transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-emerald-500">Connect</h4>
            <div className="flex flex-col space-y-2">
              <a
                href={`mailto:${siteConfig.site.author.email}`}
                className="text-white hover:text-accent transition-colors duration-200"
              >
                {siteConfig.site.author.email}
              </a>
              <a
                href={siteConfig.site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-white text-sm">
            © {currentYear} {siteConfig.site.author.name}. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="/privacy"
              className="text-white hover:text-accent text-sm transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-white hover:text-accent text-sm transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}