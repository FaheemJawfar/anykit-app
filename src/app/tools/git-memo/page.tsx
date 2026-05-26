"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  GitBranch, 
  Copy, 
  Check, 
  Search,
  Terminal,
  Zap,
  Info,
  ExternalLink,
  BookOpen,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

const GIT_COMMANDS = [
  {
    category: "Configuration",
    items: [
      { name: "Set Global Name", cmd: 'git config --global user.name "[name]"', desc: "Sets the name you want atttached to your commit transactions" },
      { name: "Set Global Email", cmd: 'git config --global user.email "[email]"', desc: "Sets the email you want atttached to your commit transactions" },
      { name: "List Config", cmd: "git config --list", desc: "List all configuration variables" }
    ]
  },
  {
    category: "Starting Repos",
    items: [
      { name: "Initialize", cmd: "git init", desc: "Create a local repository" },
      { name: "Clone", cmd: "git clone [url]", desc: "Download a project and its entire version history" }
    ]
  },
  {
    category: "Commit & Push",
    items: [
      { name: "Stage All", cmd: "git add .", desc: "Add all current changes to the next commit" },
      { name: "Commit", cmd: 'git commit -m "[message]"', desc: "Commit your staged content" },
      { name: "Push", cmd: "git push origin [branch]", desc: "Push your local commits to the remote" },
      { name: "Pull", cmd: "git pull", desc: "Fetch and merge any commits from the tracking remote" }
    ]
  },
  {
    category: "Branching",
    items: [
      { name: "Create Branch", cmd: "git branch [name]", desc: "Create a new branch" },
      { name: "Switch Branch", cmd: "git checkout [name]", desc: "Switch to a specific branch" },
      { name: "Create & Switch", cmd: "git checkout -b [name]", desc: "Create a new branch and switch to it" },
      { name: "List Branches", cmd: "git branch", desc: "List all local branches" }
    ]
  },
  {
    category: "Mistakes & Undo",
    items: [
      { name: "Amend Message", cmd: "git commit --amend", desc: "Change the message of the last commit" },
      { name: "Soft Reset", cmd: "git reset HEAD~1", desc: "Undo last commit, keep changes staged" },
      { name: "Hard Reset", cmd: "git reset --hard HEAD~1", desc: "Undo last commit and DISCARD all changes" },
      { name: "Stash Changes", cmd: "git stash", desc: "Temporarily store all modified tracked files" }
    ]
  }
];

export default function GitMemo() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredMemos = GIT_COMMANDS.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.cmd.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <ToolLayout toolId="git-memo">

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands (e.g. reset, branch, config)..."
            className="h-12 pl-12 pr-6 rounded-2xl bg-card border-border/40 font-bold focus:ring-primary/20 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Click command to copy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {filteredMemos.map((cat, i) => (
          <div key={i} className="space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-2 px-1">
              <BookOpen className="w-4 h-4 text-primary/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{cat.category}</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {cat.items.map((item, j) => (
                <Card 
                  key={j} 
                  onClick={() => copy(item.cmd)}
                  className="group cursor-pointer border-border/40 bg-card/40 backdrop-blur-sm rounded-3xl transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-foreground/90">{item.name}</h3>
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                        copied === item.cmd ? "bg-green-500 text-white" : "bg-muted text-muted-foreground opacity-0 group-hover:opacity-100"
                      )}>
                        {copied === item.cmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-muted/30 font-mono text-xs text-primary font-bold break-all border border-transparent group-hover:border-primary/10 group-hover:bg-primary/5 transition-all">
                      $ {item.cmd}
                    </div>
                    
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredMemos.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">No Commands Found</h3>
            <p className="text-sm text-muted-foreground">Try searching for a different keyword.</p>
          </div>
        </div>
      )}

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-primary">Need more help?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            This is just a quick reference. For deeper documentation, we recommend checking the official <a href="https://git-scm.com/doc" target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">Git Documentation</a> or using <code>git help [command]</code> in your terminal.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
