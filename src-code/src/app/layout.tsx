
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import siteConfig from "@/data/site-config.json";

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
      </body>
    </html>
  );
}
