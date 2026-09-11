import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoConverterClient from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("video-converter");

export default function VideoConverter() {
  const jsonLd = generateToolJsonLd("video-converter");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoConverterClient />
      <ToolSeoContent toolId="video-converter" />
    </>
  );
}
