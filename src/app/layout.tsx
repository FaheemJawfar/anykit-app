import type { Metadata, Viewport } from "next";
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
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
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
      data-scroll-behavior="smooth"
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
          defaultTheme="system"
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
              <Header />
              <main className="flex-1">{children}</main>

              <footer className="mt-auto border-t border-border/60 bg-background">
                <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-10">
                    <div className="space-y-4 max-w-md">
                      <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden ring-1 ring-border">
                          <img src="/logo.svg" alt="AnyKit" className="w-full h-full" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">AnyKit App</span>
                      </Link>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        A fast, privacy-first toolkit with 100+ browser-powered utilities built for developers, creators, and everyday workflows.
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          No signup
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
                          In-browser processing
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
                          Free forever
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-3.5">Popular Categories</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/category/developer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">Developer Tools <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/category/text" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">Text Utilities <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/category/converter" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">Converters <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/category/security" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">Security Tools <ArrowRight className="w-3 h-3" /></Link></li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-3.5">Resources</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">All Tools <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/privacy" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">Privacy Policy <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="/terms" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">Terms of Service <ArrowRight className="w-3 h-3" /></Link></li>
                        <li><Link href="https://github.com/FaheemJawfar/anykit-app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">Open Source GitHub <ArrowRight className="w-3 h-3" /></Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                      © 2026 AnyKit App. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        All Systems Operational
                      </span>
                      <span className="rounded-md border border-border px-2 py-1">v1.0.0</span>
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
