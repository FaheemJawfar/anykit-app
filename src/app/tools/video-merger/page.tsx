import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoMergerClient from "./client";

export const metadata = generateToolMetadata("video-merger");

export default function VideoMerger() {
  const jsonLd = generateToolJsonLd("video-merger");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoMergerClient />
    </>
  );
}
