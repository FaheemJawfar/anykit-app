import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoTrimmerClient from "./client";

export const metadata = generateToolMetadata("video-trimmer");

export default function VideoTrimmer() {
  const jsonLd = generateToolJsonLd("video-trimmer");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoTrimmerClient />
    </>
  );
}
