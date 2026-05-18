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
    <Link href={tool.path}>
      <Card className="h-full hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group border-border/50 hover:border-primary/50">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
              {tool.icon}
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {tool.category}
            </Badge>
          </div>
          <CardTitle className="text-base group-hover:text-primary transition-colors">{tool.name}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">{tool.description}</CardDescription>
        </CardHeader>
        {tool.tags && tool.tags.length > 0 && (
          <CardContent className="p-4 pt-2">
            <div className="flex flex-wrap gap-1 mb-2">
              {tool.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
              Open tool
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
