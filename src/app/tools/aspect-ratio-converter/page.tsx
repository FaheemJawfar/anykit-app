import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import AspectRatioConverterClient from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("aspect-ratio-converter");

export default function AspectRatioConverter() {
  const jsonLd = generateToolJsonLd("aspect-ratio-converter");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AspectRatioConverterClient />
      <ToolSeoContent toolId="aspect-ratio-converter" />
    </>
  );
}
