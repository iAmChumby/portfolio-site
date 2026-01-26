import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Luke Edwards\' portfolio website.',
  openGraph: {
    title: 'Terms of Service | Luke Edwards',
    description: 'Terms of Service for Luke Edwards\' portfolio website.',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      <div className="relative z-10">
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <div className="relative inline-block neu-surface p-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
                    <span className="neu-text-gradient">Terms of Service</span>
                  </h1>
                  <p className="text-lg text-neu-text-secondary">
                    Last updated: January 26, 2026
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8">
                {/* Introduction */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Agreement to Terms</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    By accessing and using this website (lukeedwards.me), you agree to be bound by these Terms of Service. 
                    If you disagree with any part of these terms, please do not use this website.
                  </p>
                </div>

                {/* Description */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">About This Website</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    This is a personal portfolio website owned and operated by Luke Edwards. It is designed to showcase 
                    my work, skills, and professional background. This website is not a commercial service and does not 
                    sell any products or services.
                  </p>
                </div>

                {/* Intellectual Property */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Intellectual Property</h2>
                  <p className="text-neu-text-secondary leading-relaxed mb-4">
                    Unless otherwise stated, I own the intellectual property rights for all original content on this website, 
                    including but not limited to text, design elements, and code. Some project screenshots and external 
                    assets may be subject to third-party copyrights.
                  </p>
                  <p className="text-neu-text-secondary leading-relaxed">
                    You may view and reference content on this website for personal, non-commercial purposes. 
                    Reproduction, distribution, or modification of content without prior written permission is prohibited.
                  </p>
                </div>

                {/* Contact Form Usage */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Contact Form Usage</h2>
                  <p className="text-neu-text-secondary leading-relaxed mb-4">
                    The contact form is provided for legitimate professional inquiries, including:
                  </p>
                  <ul className="list-disc list-inside text-neu-text-secondary space-y-1 ml-4 mb-4">
                    <li>Job and co-op opportunities</li>
                    <li>Freelance project inquiries</li>
                    <li>Professional collaboration requests</li>
                    <li>General questions about my work</li>
                  </ul>
                  <p className="text-neu-text-secondary leading-relaxed">
                    You agree not to use the contact form for spam, harassment, or any unlawful purpose. 
                    Abuse of the contact form may result in your IP address being blocked.
                  </p>
                </div>

                {/* User Conduct */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">User Conduct</h2>
                  <p className="text-neu-text-secondary leading-relaxed mb-4">
                    When using this website, you agree not to:
                  </p>
                  <ul className="list-disc list-inside text-neu-text-secondary space-y-1 ml-4">
                    <li>Attempt to gain unauthorized access to the website or its systems</li>
                    <li>Use automated tools to scrape, crawl, or extract data beyond what is publicly accessible</li>
                    <li>Submit false or misleading information through the contact form</li>
                    <li>Engage in any activity that disrupts or interferes with the website&apos;s functionality</li>
                    <li>Use the website for any illegal or unauthorized purpose</li>
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Disclaimer</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    This website and its content are provided &quot;as is&quot; without warranties of any kind, 
                    either express or implied. I make no representations or warranties regarding the accuracy, 
                    completeness, or reliability of any content on this website. Project descriptions and 
                    technologies listed reflect the state at the time of development.
                  </p>
                </div>

                {/* Limitation of Liability */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Limitation of Liability</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    To the fullest extent permitted by applicable law, I shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages arising out of or relating to your 
                    use of this website. This includes, but is not limited to, damages for loss of profits, 
                    goodwill, data, or other intangible losses.
                  </p>
                </div>

                {/* External Links */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">External Links</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    This website may contain links to external websites (such as GitHub, LinkedIn, or project demos). 
                    I am not responsible for the content, privacy policies, or practices of any third-party websites. 
                    Accessing external links is at your own risk.
                  </p>
                </div>

                {/* Governing Law */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Governing Law</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    These Terms of Service shall be governed by and construed in accordance with the laws of the 
                    State of New York, United States, without regard to its conflict of law provisions.
                  </p>
                </div>

                {/* Changes */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Changes to Terms</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    I reserve the right to modify these Terms of Service at any time. Changes will be effective 
                    immediately upon posting to this page. Your continued use of the website after any changes 
                    constitutes acceptance of the modified terms.
                  </p>
                </div>

                {/* Contact */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Contact</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    If you have any questions about these Terms of Service, please contact me at{' '}
                    <a 
                      href="mailto:edwards.lukec@gmail.com" 
                      className="text-neu-accent hover:text-neu-accent-light underline"
                    >
                      edwards.lukec@gmail.com
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
