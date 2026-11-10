import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { siteConfig } from "@/content/site";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { RouteTransitionProvider } from "@/components/motion/RouteTransition";
import { ThemeProvider } from "@/components/motion/ThemeProvider";
import { ClientCursor } from "@/components/motion/ClientCursor";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

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

export const viewport: Viewport = {
  themeColor: "#F4F5F7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("portfolio-theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased font-body">
        <PostHogProvider>
          <ThemeProvider>
            <SmoothScrollProvider>
              <RouteTransitionProvider>
                <ClientCursor />
                {children}
              </RouteTransitionProvider>
            </SmoothScrollProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
