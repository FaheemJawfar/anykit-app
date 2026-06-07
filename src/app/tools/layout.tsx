import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RelatedTools } from "@/components/related-tools";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-3 pb-0">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>
      </div>
      {children}
      <RelatedTools />
    </div>
  );
}
