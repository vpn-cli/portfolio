import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/content/site";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { RouteTransitionProvider } from "@/components/motion/RouteTransition";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ThemeProvider } from "@/components/motion/ThemeProvider";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.bio,
  metadataBase: new URL("https://vipinkaushik.dev"),
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.bio,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.bio,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-body">
        <ThemeProvider>
          <SmoothScrollProvider>
            <RouteTransitionProvider>
              <CustomCursor />
              {children}
            </RouteTransitionProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
