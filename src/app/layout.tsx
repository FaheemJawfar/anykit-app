import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { SupportPrompt } from "@/components/support-prompt";
import { ToastProvider } from "@/hooks/use-toast";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { StatCounter } from "@statcounter/nextjs";

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AnyKit App",
  url: "https://anykit.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://anykit.app/#search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anykit.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AnyKit App - 160+ Best Free Online Developer & Utility Tools",
    template: "%s | AnyKit App",
  },
  description:
    "Best free collection of 160+ all-in-one online tools for developers, designers, students, and everyday tasks. JSON formatter, PDF tools, Base64 encoder, color converter, regex tester, QR code generator, and more. All browser-based — no sign-up required.",
  keywords: [
    "online tools",
    "best free online tools",
    "all in one free online tools",
    "free online tools for students",
    "developer tools",
    "free online tools",
    "JSON formatter",
    "Base64 encoder",
    "PDF tools",
    "color converter",
    "regex tester",
    "UUID generator",
    "utility tools",
    "web tools",
    "coding tools",
    "privacy first tools",
    "browser based tools",
    "no signup tools",
    "free developer tools",
    "online utility tools",
    "text tools",
    "converter tools",
    "math tools",
    "image tools",
    "color tools",
    "generator tools",
    "security tools",
    "audio tools",
    "video tools",
    "online calculator",
    "timestamp converter",
    "password generator",
    "QR code generator",
    "cron expression tester",
    "SVG optimizer",
    "glassmorphism generator",
    "CSS gradient generator",
    "flexbox generator",
    "grid generator",
    "hash generator",
    "aes encryption",
    "jwt parser",
    "json viewer",
    "xml formatter",
    "sql prettify",
    "docker compose converter",
    "lorem ipsum",
    "word counter",
    "case converter",
    "text diff",
    "markdown html",
    "slugify",
    "unit converter",
    "percentage calculator",
    "stopwatch",
    "image resize",
    "color palette extractor",
    "contrast checker",
    "barcode generator",
    "wifi qr code",
    "audio converter",
    "video converter",
    "video compressor",
  ],
  authors: [{ name: "AnyKit App" }],
  creator: "AnyKit App",
  publisher: "AnyKit App",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AnyKit App",
    title: "AnyKit App - 160+ Best Free Online Developer & Utility Tools",
    description:
      "Best free collection of 160+ all-in-one online tools for developers, designers, students, and everyday tasks. All browser-based — no sign-up required.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AnyKit App - 160+ Best Free Online Developer & Utility Tools",
    description:
      "Best free collection of 160+ all-in-one online tools for developers, designers, students, and everyday tasks. All browser-based — no sign-up required.",
    images: ["/og-image.png"],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AnyKit",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-row">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_JSON_LD),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Suspense fallback={<div className="w-72 hidden lg:block h-screen border-r border-border/40" />}>
              <Sidebar />
            </Suspense>
            
            <CommandPalette />
            <SupportPrompt />

            <div className="flex-1 flex flex-col min-h-screen relative">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-220px] left-[15%] h-[460px] w-[460px] rounded-full bg-primary/[0.08] blur-[120px]" />
                <div className="absolute top-[20%] right-[-120px] h-[380px] w-[380px] rounded-full bg-accent/[0.2] blur-[120px]" />
              </div>

              <Header />
              <main className="flex-1">{children}</main>
              
              <footer className="mt-auto border-t border-border/50 bg-gradient-to-b from-background/95 via-background to-background/90 backdrop-blur-xl">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-14">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-12">
                    <div className="space-y-6 max-w-lg">
                      <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-[0_14px_26px_-18px_color-mix(in_oklch,var(--primary)_70%,transparent)] ring-1 ring-primary/20">
                          <img src="/logo.svg" alt="AnyKit" className="w-full h-full relative z-10" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">AnyKit App</span>
                      </Link>
                      <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                        A fast, privacy-first toolkit with 100+ browser-powered utilities built for developers, creators, and everyday workflows.
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 bg-card/50">
                          <Sparkles className="w-3 h-3 text-primary" />
                          No signup
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 bg-card/50">
                          In-browser processing
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 bg-card/50">
                          Free forever
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-5">Popular Categories</h3>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/?category=developer" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">Developer Tools <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/?category=text" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">Text Utilities <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/?category=converter" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">Converters <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/?category=security" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">Security Tools <ArrowRight className="w-3 h-3" /></Link></li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-5">Resources</h3>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">All Tools <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/privacy" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">Privacy Policy <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/terms" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">Terms of Service <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="https://github.com/FaheemJawfar/anykit-app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">Open Source GitHub <ArrowRight className="w-3 h-3" /></Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-5">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                      © 2026 AnyKit App. All rights reserved. Built with precision.
                    </p>
                    <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-2 rounded-full bg-card/60 border border-border/50 px-3 py-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        All Systems Operational
                      </span>
                      <span className="rounded-full bg-card/60 border border-border/50 px-3 py-1.5">v1.0.0</span>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ToastProvider>
        </ThemeProvider>
        <StatCounter project_id={13248196} security_code="282a098d" />
      </body>
    </html>
  );
}
