import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoRotatorClient from "./client";

export const metadata = generateToolMetadata("video-rotator");

export default function VideoRotator() {
  const jsonLd = generateToolJsonLd("video-rotator");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoRotatorClient />
    </>
  );
}
