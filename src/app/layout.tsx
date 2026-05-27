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
import { Button } from "@/components/ui/button";
import { Globe, Mail } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { StatCounter } from "@statcounter/nextjs";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnyKit App - Professional Utility Tools",
  description: "A comprehensive collection of magical tools for your everyday tasks.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AnyKit",
  },
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
              <Header />
              <main className="flex-1">{children}</main>
              
              <footer className="bg-background border-t border-border mt-auto">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-6">
                      <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
                          <img src="/logo.svg" alt="AnyKit" className="w-full h-full relative z-10" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">AnyKit App</span>
                      </Link>
                      <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
                        The simplest collection of high-performance online tools. Designed to help you get things done, faster and easier.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-full border-border/50 hover:bg-primary hover:text-primary-foreground transition-all">
                          <Globe className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-border/50 hover:bg-primary hover:text-primary-foreground transition-all">
                          <Mail className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-6">Tools</h3>
                      <ul className="space-y-4 text-muted-foreground">
                        <li><Link href="/?category=developer" className="hover:text-primary transition-colors">Developer Tools</Link></li>
                        <li><Link href="/?category=text" className="hover:text-primary transition-colors">Text Manipulation</Link></li>
                        <li><Link href="/?category=converter" className="hover:text-primary transition-colors">Converters</Link></li>
                        <li><Link href="/?category=security" className="hover:text-primary transition-colors">Security Tools</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-6">Company</h3>
                      <ul className="space-y-4 text-muted-foreground">
                        <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-muted-foreground">
                      © 2026 AnyKit App. All rights reserved. Built with precision.
                    </p>
                    <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        All Systems Operational
                      </span>
                      <span>v1.0.0</span>
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
