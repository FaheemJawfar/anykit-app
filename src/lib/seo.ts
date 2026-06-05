import type { Metadata } from "next";
import { getToolById, categories } from "@/lib/tools";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anykit.app";

const CATEGORY_TITLE_SUFFIX: Record<string, string> = {
  pdf: "PDF Tool",
  developer: "Developer Tool",
  text: "Text Tool",
  converter: "Converter",
  math: "Math Tool",
  image: "Image Tool",
  color: "Color Tool",
  generator: "Generator",
  security: "Security Tool",
  audio: "Audio Tool",
  video: "Video Tool",
};

export function generateToolMetadata(toolId: string): Metadata {
  const tool = getToolById(toolId);
  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested tool could not be found.",
    };
  }

  const category = categories.find((c) => c.id === tool.category);
  const titleSuffix = CATEGORY_TITLE_SUFFIX[tool.category] ?? (category?.name || "Tool");
  const title = `${tool.name} - Free Online ${titleSuffix}`;
  const descBase = tool.description.replace(/\.$/, "");
  const description = `${descBase}. Free online ${tool.name} — no sign-up, works instantly in your browser.`;

  return {
    title,
    description,
    keywords: tool.tags,
    alternates: {
      canonical: `${BASE_URL}${tool.path}`,
    },
    openGraph: {
      title: `${tool.name} - AnyKit App`,
      description: tool.description,
      url: `${BASE_URL}${tool.path}`,
      siteName: "AnyKit App",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - AnyKit App`,
      description: tool.description,
    },
  };
}

export function generateToolJsonLd(toolId: string) {
  const tool = getToolById(toolId);
  if (!tool) return null;

  const category = categories.find((c) => c.id === tool.category);

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}${tool.path}`,
    applicationCategory: category?.name || "Utility",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "AnyKit App",
      url: BASE_URL,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        ...(category
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: category.name,
                item: `${BASE_URL}/category/${category.id}`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: category ? 3 : 2,
          name: tool.name,
          item: `${BASE_URL}${tool.path}`,
        },
      ],
    },
  };
}

export function generateCategoryJsonLd(categoryId: string) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} - Free Online Tools`,
    description: category.description,
    url: `${BASE_URL}/category/${category.id}`,
    isPartOf: {
      "@type": "WebSite",
      name: "AnyKit App",
      url: BASE_URL,
    },
  };
}
