import { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/layout/Header";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import siteConfig from "@/data/site-config.json";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.site.author.name }],
  creator: siteConfig.site.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.site.url,
    siteName: siteConfig.site.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.site.name} - ${siteConfig.site.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [siteConfig.seo.ogImage],
    creator: siteConfig.seo.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});
// ... metadata ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <SmoothScrollProvider>
          <AnimatedBackground />
          <Header 
            navigation={siteConfig.site.navigation}
            siteName={siteConfig.site.name}
          />
          <main className="flex-1 pt-16 sm:pt-20 md:pt-24">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
