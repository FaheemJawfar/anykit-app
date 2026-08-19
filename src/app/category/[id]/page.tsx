import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getToolsByCategory } from "@/lib/tools";
import { generateCategoryMetadata, generateCategoryJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { CategoryBrowser } from "@/components/category-browser";
import { LucideIcon } from "@/components/lucide-icon";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const toolCount = getToolsByCategory(id).length;
  return generateCategoryMetadata(id, toolCount);
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const categoryTools = getToolsByCategory(id);
  const jsonLd = generateCategoryJsonLd(id);

  return (
    <div className="min-h-screen bg-background">
      {jsonLd && <JsonLd data={jsonLd} />}

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Header */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
              <LucideIcon name={category.icon} className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{category.name}</h1>
              <p className="text-xs text-muted-foreground">
                {categoryTools.length} tools · all browser-based
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </section>

        {/* Tool browser with subgroups + search */}
        <CategoryBrowser categoryId={category.id} tools={categoryTools} />

        {/* SEO internal links to other categories */}
        <div className="pt-4 border-t border-border/60 space-y-4">
          <h2 className="text-sm font-bold tracking-tight">Explore other categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== id)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <LucideIcon name={c.icon} className="w-3.5 h-3.5" />
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
