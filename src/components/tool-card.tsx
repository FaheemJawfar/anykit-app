import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/lib/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LucideIcon } from "@/components/lucide-icon";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.path} className="block group">
      <Card className="h-full transition-all duration-300 border-border/40 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 bg-card/40 backdrop-blur-sm overflow-hidden rounded-xl">
        <CardHeader className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 text-primary shadow-inner group-hover:bg-primary/10 transition-colors shrink-0">
              <LucideIcon name={tool.icon} className="w-5 h-5" />
              <div className="absolute inset-0 rounded-lg border border-primary/10 group-hover:border-primary/20 transition-colors" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-bold group-hover:text-primary transition-colors truncate">
                {tool.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="px-1.5 py-0 text-[9px] uppercase tracking-wider font-bold bg-muted/50 text-muted-foreground border-transparent">
                  {tool.category}
                </Badge>
                {tool.isNew && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            </div>
          </div>
          <CardDescription className="text-xs leading-relaxed line-clamp-2 text-muted-foreground/80">
            {tool.description}
          </CardDescription>
        </CardHeader>
        
        <div className="px-4 py-2 border-t border-border/40 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-primary/[0.02]">
          <span className="text-[10px] font-bold uppercase tracking-tight text-primary">Open Tool</span>
          <ArrowRight className="w-3 h-3 text-primary" />
        </div>
      </Card>
    </Link>
  );
}
