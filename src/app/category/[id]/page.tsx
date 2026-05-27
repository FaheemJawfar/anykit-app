import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getToolsByCategory } from "@/lib/tools";
import { generateCategoryJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ToolCard } from "@/components/tool-card";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) return { title: "Category Not Found" };

  const toolCount = getToolsByCategory(id).length;

  return {
    title: `${category.name} - ${toolCount} Free Online Tools`,
    description: `${category.description}. Browse ${toolCount} free online ${category.name.toLowerCase()} on AnyKit. No sign-up required.`,
    alternates: { canonical: `/category/${id}` },
    openGraph: {
      title: `${category.name} - AnyKit App`,
      description: `${category.description}. ${toolCount} free tools available.`,
      url: `/category/${id}`,
      siteName: "AnyKit App",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} - AnyKit App`,
      description: `${category.description}. ${toolCount} free tools available.`,
    },
  };
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

      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-bold">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {category.name}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {category.description}. {categoryTools.length} free tools available
            — no sign-up required.
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* SEO internal links to other categories */}
        <div className="pt-12 border-t border-border/40">
          <h2 className="text-lg font-bold mb-4">Explore More Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== id)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-muted/50 border border-border/30 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
