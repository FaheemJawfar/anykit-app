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

const CATEGORY_EXTRA_KEYWORDS: Record<string, string[]> = {
  pdf: ["free pdf tools", "pdf editing tools online free", "best free pdf tools", "merge pdf online free", "compress pdf online free", "online pdf editor", "free pdf editor"],
  developer: ["free developer tools online", "best free developer tools", "best free tools for developers", "web developer tools", "online dev tools", "coding tools"],
  text: ["free text tools online", "text editor online free", "online text formatter", "text utility tools"],
  converter: ["free online converter", "best free online converter", "unit converter online free", "file converter online"],
  math: ["free math tools online", "online calculator free", "math calculator online", "percentage calculator online"],
  image: ["free image tools online", "online image editor free", "image resizer online free", "svg optimizer online"],
  color: ["free color tools online", "color converter online", "hex to rgb online", "online color picker"],
  generator: ["free generator tools online", "online password generator free", "qr code generator online free", "uuid generator online"],
  security: ["free security tools online", "online encryption tool free", "hash generator online", "password strength checker online"],
  audio: ["free audio tools online", "audio converter online free", "online audio editor free", "mp3 converter online"],
  video: ["free video tools online", "video converter online free", "online video compressor free", "mp4 converter online"],
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
  const description = `${descBase}. Free online ${tool.name} — no sign-up, works instantly in your browser. Part of AnyKit's 160+ privacy-first utility tools.`;
  const enhancedKeywords = [
    ...(tool.tags || []),
    "free online tool",
    "browser based",
    "no signup",
    "privacy first",
    titleSuffix.toLowerCase(),
  ];

  return {
    title,
    description,
    keywords: enhancedKeywords,
    alternates: {
      canonical: `${BASE_URL}${tool.path}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: tool.name,
    },
    openGraph: {
      title: `${tool.name} - AnyKit App`,
      description: tool.description,
      url: `${BASE_URL}${tool.path}`,
      siteName: "AnyKit App",
      type: "website",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - AnyKit App`,
      description: tool.description,
      images: ["/og-image.png"],
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
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.name,
          item: `${BASE_URL}/category/${category.id}`,
        },
      ],
    },
  };
}

export function generateCategoryMetadata(categoryId: string, toolCount: number): Metadata {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} - ${toolCount} Free Online Tools`,
    description: `${category.description}. Browse ${toolCount} free online ${category.name.toLowerCase()} on AnyKit. No sign-up required.`,
    keywords: [
      category.name.toLowerCase(),
      "free online tools",
      "developer tools",
      "utility tools",
      "web tools",
      "no signup",
      "browser based",
      "privacy first",
      ...(CATEGORY_EXTRA_KEYWORDS[categoryId] || []),
    ],
    alternates: { canonical: `/category/${categoryId}` },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${category.name} - AnyKit App`,
      description: `${category.description}. ${toolCount} free tools available.`,
      url: `/category/${categoryId}`,
      siteName: "AnyKit App",
      type: "website",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} - AnyKit App`,
      description: `${category.description}. ${toolCount} free tools available.`,
      images: ["/og-image.png"],
    },
  };
}
