"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Copy, 
  Check, 
  Trash2,
  Zap,
  AlertCircle,
  FileCode,
  Braces,
  Settings2,
  Code2,
  Search,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parse, print, visit, Kind } from "graphql";

export default function GraphQLToJSON() {
  const [input, setInput] = useState("query GetUser($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    email\n    profile {\n      bio\n      avatar\n    }\n  }\n}");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = (gql: string) => {
    setInput(gql);
    setError(null);
    if (!gql.trim()) {
      setOutput("");
      return;
    }

    try {
      const ast = parse(gql);
      const json: any = {
        operation: "",
        name: "",
        fields: []
      };

      visit(ast, {
        OperationDefinition(node) {
          json.operation = node.operation;
          json.name = node.name?.value || "Anonymous";
        },
        Field(node) {
          // This is a simplified extraction for visualization
          // A full GraphQL-to-JSON mapper would be more complex
        }
      });

      // For a better user utility, we'll output the AST-like structure 
      // or a mock response object based on the query
      const mockResponse: any = {};
      
      const buildMock = (selectionSet: any, parent: any) => {
        selectionSet.selections.forEach((selection: any) => {
          if (selection.kind === Kind.FIELD) {
            const name = selection.name.value;
            if (selection.selectionSet) {
              parent[name] = {};
              buildMock(selection.selectionSet, parent[name]);
            } else {
              parent[name] = `Value for ${name}`;
            }
          }
        });
      };

      const operation = ast.definitions[0] as any;
      if (operation && operation.selectionSet) {
        buildMock(operation.selectionSet, mockResponse);
      }

      setOutput(JSON.stringify(mockResponse, null, 2));
    } catch (e: any) {
      setError(e.message || "Failed to parse GraphQL. Ensure syntax is valid.");
      setOutput("");
    }
  };

  useMemo(() => {
    convert(input);
  }, []);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="gql-json">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">GraphQL Query</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => convert("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="query { ... }"
              value={input}
              onChange={(e) => convert(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Braces className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Mock JSON Result</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!output}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy Mock"}
            </Button>
          </div>
          
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  GQL Parse Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 font-mono text-xs leading-loose text-foreground/80 overflow-auto whitespace-pre selection:bg-primary/20">
                {output || <span className="text-muted-foreground italic opacity-50">Mock response will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Tool Logic</h3>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
          This tool parses your GraphQL query AST (Abstract Syntax Tree) to visualize the data structure it expects. It's perfect for frontend developers who want to quickly generate mock data for UI components before the backend is ready.
        </p>
      </div>
    </ToolLayout>
  );
}
