import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Luke Edwards\' portfolio website. Learn how we collect, use, and protect your information.',
  openGraph: {
    title: 'Privacy Policy | Luke Edwards',
    description: 'Privacy Policy for Luke Edwards\' portfolio website.',
  },
};

export default function PrivacyPage() {
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
                    <span className="neu-text-gradient">Privacy Policy</span>
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
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Introduction</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    This Privacy Policy describes how Luke Edwards (&quot;I&quot;, &quot;me&quot;, or &quot;my&quot;) collects, uses, and 
                    handles your information when you visit my personal portfolio website at lukeedwards.me. 
                    I respect your privacy and am committed to being transparent about the data practices on this site.
                  </p>
                </div>

                {/* Information Collection */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Information I Collect</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-neu-text-primary mb-2">Contact Form Submissions</h3>
                      <p className="text-neu-text-secondary leading-relaxed mb-3">
                        When you submit the contact form, I collect:
                      </p>
                      <ul className="list-disc list-inside text-neu-text-secondary space-y-1 ml-4">
                        <li>Your name (as provided by you)</li>
                        <li>Your email address (as provided by you)</li>
                        <li>Your message content (as provided by you)</li>
                        <li>Your IP address (collected automatically)</li>
                        <li>Approximate geographic location (derived from your IP address or browser geolocation if you have previously granted permission)</li>
                        <li>Submission timestamp</li>
                      </ul>
                      <p className="text-neu-text-secondary leading-relaxed mt-3">
                        This information is stored securely in Google Sheets and used solely to respond to your inquiry 
                        and understand where my visitors are located.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neu-text-primary mb-2">Like System (Now Page)</h3>
                      <p className="text-neu-text-secondary leading-relaxed mb-3">
                        The &quot;Now&quot; page includes a like feature for posts. To track likes without requiring account creation, 
                        I generate an anonymous browser fingerprint based on:
                      </p>
                      <ul className="list-disc list-inside text-neu-text-secondary space-y-1 ml-4">
                        <li>Browser user agent</li>
                        <li>Screen resolution and color depth</li>
                        <li>Timezone and language settings</li>
                        <li>Hardware characteristics</li>
                      </ul>
                      <p className="text-neu-text-secondary leading-relaxed mt-3">
                        This fingerprint is hashed and stored in your browser&apos;s localStorage and on my server (Redis) 
                        to remember your like preferences. It cannot be used to personally identify you.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neu-text-primary mb-2">Analytics</h3>
                      <p className="text-neu-text-secondary leading-relaxed">
                        I use Vercel Analytics, a privacy-focused analytics service that collects anonymous, 
                        aggregated data about page views and visitor counts. Vercel Analytics does not use cookies 
                        and does not track individual users across sites.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neu-text-primary mb-2">Bot Protection</h3>
                      <p className="text-neu-text-secondary leading-relaxed">
                        The contact form uses Cloudflare Turnstile to protect against spam and automated submissions. 
                        Turnstile may collect technical information about your browser to verify you are human. 
                        Please refer to{' '}
                        <a 
                          href="https://www.cloudflare.com/privacypolicy/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-neu-accent hover:text-neu-accent-light underline"
                        >
                          Cloudflare&apos;s Privacy Policy
                        </a>
                        {' '}for more details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Third-Party Services */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Third-Party Services</h2>
                  <p className="text-neu-text-secondary leading-relaxed mb-4">
                    This website uses the following third-party services:
                  </p>
                  <ul className="list-disc list-inside text-neu-text-secondary space-y-2 ml-4">
                    <li><strong>Vercel</strong> – Hosting and privacy-focused analytics</li>
                    <li><strong>Cloudflare Turnstile</strong> – Bot protection for the contact form</li>
                    <li><strong>Upstash Redis</strong> – Storing like counts and rate limiting data</li>
                    <li><strong>Google Sheets API</strong> – Storing contact form submissions</li>
                    <li><strong>ipapi.co</strong> – IP-based geolocation lookup</li>
                    <li><strong>OpenStreetMap Nominatim</strong> – Reverse geocoding (if browser location is available)</li>
                  </ul>
                </div>

                {/* Data Retention */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Data Retention</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    Contact form submissions are retained indefinitely for record-keeping purposes. 
                    Like data and browser fingerprints are stored for as long as the feature is active. 
                    Rate limiting data expires automatically after 1 hour.
                  </p>
                </div>

                {/* Your Rights */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Your Rights</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    If you would like to request deletion of your contact form submission or have any questions 
                    about your data, please contact me at{' '}
                    <a 
                      href="mailto:edwards.lukec@gmail.com" 
                      className="text-neu-accent hover:text-neu-accent-light underline"
                    >
                      edwards.lukec@gmail.com
                    </a>.
                  </p>
                </div>

                {/* Updates */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Changes to This Policy</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    I may update this Privacy Policy from time to time. Any changes will be posted on this page 
                    with an updated revision date.
                  </p>
                </div>

                {/* Contact */}
                <div className="neu-surface p-8">
                  <h2 className="text-2xl font-bold text-neu-text-primary mb-4">Contact</h2>
                  <p className="text-neu-text-secondary leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact me at{' '}
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
