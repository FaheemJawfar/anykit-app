import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/lib/tools";
import Link from "next/link";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.path}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="text-4xl mb-2">{tool.icon}</div>
            <Badge variant="secondary" className="text-xs">
              {tool.category}
            </Badge>
          </div>
          <CardTitle className="text-lg">{tool.name}</CardTitle>
          <CardDescription className="text-sm">{tool.description}</CardDescription>
        </CardHeader>
        {tool.tags && tool.tags.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
