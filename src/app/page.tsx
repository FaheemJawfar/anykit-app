import { tools, categories } from "@/lib/tools";
import { generateHomeJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import Link from "next/link";
import HomeClient from "./home-client";

export default function HomePage() {
  const jsonLd = generateHomeJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeClient />

      {/* Server-rendered tool directory for SEO — crawlable by search engines */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl font-bold mb-2">All Tools Directory</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Browse our complete collection of {tools.length}+ free online tools
            organized by category. Every tool works instantly in your browser
            with no sign-up required.
          </p>

          <div className="space-y-10">
            {categories.map((category) => {
              const categoryTools = tools.filter(
                (t) => t.category === category.id
              );
              if (categoryTools.length === 0) return null;
              return (
                <div key={category.id}>
                  <h3 className="text-lg font-bold mb-1">
                    <Link
                      href={`/category/${category.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2">
                    {categoryTools.map((tool) => (
                      <li key={tool.id}>
                        <Link
                          href={tool.path}
                          className="text-sm text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1.5 py-1"
                        >
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-muted-foreground/60 hidden sm:inline">
                            — {tool.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
