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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {jsonLd && <JsonLd data={jsonLd} />}

      <div className="absolute -top-24 left-[12%] h-[460px] w-[460px] rounded-full bg-primary/[0.12] blur-[120px] pointer-events-none" />
      <div className="absolute top-[18%] right-[-120px] h-[380px] w-[380px] rounded-full bg-accent/[0.2] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80 bg-card/45 border border-border/45 rounded-xl px-3 py-2 w-fit max-w-full overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-bold">{category.name}</span>
        </nav>

        <section className="rounded-3xl border border-border/45 bg-card/60 backdrop-blur-xl p-6 md:p-8 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.55)]">
          <div className="space-y-3 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {categoryTools.length} tools in this category
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              {category.description}. Explore {categoryTools.length} browser-based tools with no sign-up required.
            </p>
          </div>
        </section>

        {/* Tool Grid */}
        <section className="rounded-3xl border border-border/45 bg-card/55 backdrop-blur-xl p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* SEO internal links to other categories */}
        <div className="rounded-2xl border border-border/45 bg-card/55 backdrop-blur-xl p-5 md:p-6">
          <h2 className="text-lg font-bold mb-4">Explore More Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== id)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-background/70 border border-border/40 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
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
