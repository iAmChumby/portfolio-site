'use client';

import siteConfig from '@/data/site-config.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-12 relative overflow-hidden">
      {/* Neumorphic surface container with dark theme */}
      <div className="absolute inset-0 bg-[#0a1510] border-t border-[#234d35]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="neu-surface p-6 sm:p-8 space-y-4 text-center md:text-left">
            <h3 className="text-xl font-bold neu-text-gradient">
              {siteConfig.site.author.name}
            </h3>
            <p className="text-base text-neu-text-secondary max-w-sm mx-auto md:mx-0">
              Full-stack developer passionate about creating innovative web solutions and beautiful user experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="neu-surface p-6 sm:p-8 space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-neu-text-primary">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              {['About', 'Technologies', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-neu-text-secondary hover:text-neu-accent transition-colors duration-200 flex items-center justify-center md:justify-start group"
                >
                  <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2 h-[2px] bg-neu-accent"></span>
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="neu-surface p-6 sm:p-8 space-y-4 text-center md:text-left">
            <h4 className="text-lg font-semibold text-neu-text-primary">Connect</h4>
            <div className="flex flex-col space-y-3">
              <a
                href={`mailto:${siteConfig.site.author.email}`}
                className="text-neu-text-secondary hover:text-neu-accent transition-colors duration-200"
              >
                {siteConfig.site.author.email}
              </a>
              <a
                href={siteConfig.site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neu-text-secondary hover:text-neu-accent transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neu-text-secondary hover:text-neu-accent transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[#234d35] flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-center sm:text-left">
          <p className="text-neu-text-muted text-sm">
            © {currentYear} {siteConfig.site.author.name}. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="/privacy"
              className="text-neu-text-muted hover:text-neu-text-primary text-sm transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-neu-text-muted hover:text-neu-text-primary text-sm transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}