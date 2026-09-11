import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoCompressorClient from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("video-compressor");

export default function VideoCompressor() {
  const jsonLd = generateToolJsonLd("video-compressor");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoCompressorClient />
      <ToolSeoContent toolId="video-compressor" />
    </>
  );
}
