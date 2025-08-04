import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { AnimatedBackground } from "@/components/ui";
import siteConfig from "@/data/site-config.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.site.author.name, url: siteConfig.site.url }],
  creator: siteConfig.site.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.site.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.site.name,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    creator: siteConfig.seo.twitterHandle,
    images: [siteConfig.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: 'transparent', color: '#ffffff' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: 'transparent', color: '#ffffff', minHeight: '100vh' }}
      >
        <AnimatedBackground />
        <div style={{ position: 'relative', zIndex: 10, background: 'rgba(42, 42, 42, 0.8)' }}>
          <Header 
            navigation={siteConfig.site.navigation}
            siteName={siteConfig.site.name}
          />
          <main className="min-h-screen" style={{ background: 'transparent' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
