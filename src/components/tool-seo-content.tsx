import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolById, getToolsByCategory, categories, type Tool } from "@/lib/tools";
import { getToolContent } from "@/content/tools";
import { LucideIcon } from "@/components/lucide-icon";

interface ToolSeoContentProps {
  toolId: string;
}

function pickRelated(toolId: string, explicit?: string[]): Tool[] {
  const tool = getToolById(toolId);
  if (!tool) return [];
  const fromExplicit = (explicit ?? []).map((id) => getToolById(id)).filter((t): t is Tool => !!t && t.id !== toolId);
  if (fromExplicit.length >= 4) return fromExplicit.slice(0, 6);
  const sameCategory = getToolsByCategory(tool.category).filter((t) => t.id !== toolId && !fromExplicit.some((e) => e.id === t.id));
  return [...fromExplicit, ...sameCategory].slice(0, 6);
}

// Server-rendered, crawlable content block shown under every tool workspace.
// Rich sections come from src/content/tools/<id>.ts; related-tool links are
// always rendered so each page has unique internal linking even without prose.
export function ToolSeoContent({ toolId }: ToolSeoContentProps) {
  const tool = getToolById(toolId);
  if (!tool) return null;
  const content = getToolContent(toolId);
  const category = categories.find((c) => c.id === tool.category);
  const related = pickRelated(toolId, content?.related);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 md:pb-16 space-y-10 text-foreground">
      {content && (
        <article className="rounded-3xl border border-border/45 bg-card/50 backdrop-blur-xl p-6 md:p-8 lg:p-10 space-y-10">
          <header className="space-y-3">
            <h2 className="text-xl md:text-2xl font-black tracking-tight">About the {tool.name}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">{content.intro}</p>
          </header>

          {content.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight">{section.heading}</h3>
              {section.paragraphs?.map((p, i) => (
                <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">{p}</p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">
                  {section.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}

          {content.howTo.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight">How to use the {tool.name}</h3>
              <ol className="space-y-2.5 max-w-4xl">
                {content.howTo.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm md:text-base leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span><span className="font-semibold">{step.name}.</span> <span className="text-muted-foreground">{step.text}</span></span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {content.faqs.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight">Frequently asked questions</h3>
              <dl className="space-y-4 max-w-4xl">
                {content.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-border/45 bg-background/60 p-4 md:p-5">
                    <dt className="font-semibold text-sm md:text-base">{faq.question}</dt>
                    <dd className="mt-1.5 text-sm md:text-base text-muted-foreground leading-relaxed">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </article>
      )}

      {related.length > 0 && (
        <section className="space-y-4" aria-labelledby="related-tools-heading">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 id="related-tools-heading" className="text-lg font-bold tracking-tight">Related tools</h2>
            {category && (
              <Link href={`/category/${category.id}`} className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                All {category.name} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {related.map((t) => (
              <li key={t.id}>
                <Link href={t.path} className="group flex items-start gap-3 h-full rounded-xl border border-border/60 bg-card/60 p-3.5 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]">
                  <span className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-muted-foreground shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <LucideIcon name={t.icon} className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate group-hover:text-primary transition-colors">{t.name}</span>
                    <span className="block text-xs text-muted-foreground line-clamp-2 mt-0.5">{t.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
