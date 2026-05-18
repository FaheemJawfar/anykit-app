import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/lib/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.path} className="block h-full group">
      <Card className="h-full flex flex-col transition-all duration-300 border-border/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
        <CardHeader className="p-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 text-2xl shadow-inner group-hover:bg-primary/10 transition-colors">
              {tool.icon}
              <div className="absolute inset-0 rounded-xl border border-primary/10 group-hover:border-primary/20 transition-colors" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className="px-2 py-0 text-[10px] uppercase tracking-wider font-bold bg-muted/50 text-muted-foreground border-transparent">
                {tool.category}
              </Badge>
              {tool.tags?.[0] && (
                <span className="text-[10px] text-muted-foreground/60 font-medium">#{tool.tags[0]}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
              {tool.name}
              {tool.isNew && (
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed line-clamp-2 text-muted-foreground/80">
              {tool.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <div className="px-6 py-4 bg-muted/30 border-t border-border/40 flex items-center justify-between group-hover:bg-primary/[0.02] transition-colors mt-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            Try Tool
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Card>
    </Link>
  );
}
