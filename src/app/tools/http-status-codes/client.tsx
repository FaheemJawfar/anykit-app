"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Search, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  ExternalLink,
  BookOpen,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const HTTP_STATUS_CODES = [
  { code: 100, name: "Continue", category: "Informational", description: "The server has received the request headers and the client should proceed to send the request body." },
  { code: 101, name: "Switching Protocols", category: "Informational", description: "The requester has asked the server to switch protocols." },
  { code: 200, name: "OK", category: "Success", description: "Standard response for successful HTTP requests." },
  { code: 201, name: "Created", category: "Success", description: "The request has been fulfilled, resulting in the creation of a new resource." },
  { code: 202, name: "Accepted", category: "Success", description: "The request has been accepted for processing, but the processing has not been completed." },
  { code: 204, name: "No Content", category: "Success", description: "The server successfully processed the request and is not returning any content." },
  { code: 301, name: "Moved Permanently", category: "Redirection", description: "This and all future requests should be directed to the given URI." },
  { code: 302, name: "Found", category: "Redirection", description: "The resource was found, but at a different URI." },
  { code: 304, name: "Not Modified", category: "Redirection", description: "Indicates that the resource has not been modified since the version specified by the request headers." },
  { code: 400, name: "Bad Request", category: "Client Error", description: "The server cannot or will not process the request due to an apparent client error." },
  { code: 401, name: "Unauthorized", category: "Client Error", description: "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided." },
  { code: 403, name: "Forbidden", category: "Client Error", description: "The request contained valid data and was understood by the server, but the server is refusing action." },
  { code: 404, name: "Not Found", category: "Client Error", description: "The requested resource could not be found but may be available in the future." },
  { code: 405, name: "Method Not Allowed", category: "Client Error", description: "A request method is not supported for the requested resource." },
  { code: 408, name: "Request Timeout", category: "Client Error", description: "The server timed out waiting for the request." },
  { code: 429, name: "Too Many Requests", category: "Client Error", description: "The user has sent too many requests in a given amount of time." },
  { code: 500, name: "Internal Server Error", category: "Server Error", description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable." },
  { code: 502, name: "Bad Gateway", category: "Server Error", description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server." },
  { code: 503, name: "Service Unavailable", category: "Server Error", description: "The server cannot handle the request (because it is overloaded or down for maintenance)." },
  { code: 504, name: "Gateway Timeout", category: "Server Error", description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server." },
];

export default function HTTPStatusCodes() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const categories = ["Informational", "Success", "Redirection", "Client Error", "Server Error"];

  const filteredCodes = HTTP_STATUS_CODES.filter(item => {
    const matchesSearch = item.code.toString().includes(search) || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const copyCode = (code: number) => {
    navigator.clipboard.writeText(code.toString());
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Informational": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Success": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Redirection": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Client Error": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Server Error": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "";
    }
  };

  return (
    <ToolLayout toolId="http-status-codes">

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code or name (e.g. 404 or Not Found)"
            className="h-12 pl-12 pr-6 rounded-2xl bg-card border-border/40 font-bold focus:ring-primary/20 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            className="rounded-xl h-10 font-bold px-4"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-xl h-10 font-bold px-4 transition-all",
                activeCategory === cat && "shadow-lg"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCodes.map((item) => (
          <Card 
            key={item.code} 
            className="group border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
          >
            <CardContent className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black tracking-tighter text-foreground leading-none">{item.code}</span>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      getCategoryColor(item.category)
                    )}>
                      {item.category}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground/90">{item.name}</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyCode(item.code)}
                  className="rounded-xl h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  {copied === item.code ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              <div className="pt-4 border-t border-border/10 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Globe className="w-3 h-3" />
                  RFC Standard
                </div>
                <a 
                  href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${item.code}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  MDN Docs
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCodes.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
              <Filter className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">No Results Found</h3>
              <p className="text-sm text-muted-foreground">Try searching for a different code or name.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Zap className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-primary">Status Code Quick Reference</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            HTTP status codes are divided into five classes: <strong>1xx</strong> (Informational), <strong>2xx</strong> (Success), <strong>3xx</strong> (Redirection), <strong>4xx</strong> (Client Error), and <strong>5xx</strong> (Server Error). They help developers understand the result of an HTTP request and debug issues effectively.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
