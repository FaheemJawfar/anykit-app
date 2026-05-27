import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoScreenshotClient from "./client";

export const metadata = generateToolMetadata("video-screenshot");

export default function VideoScreenshot() {
  const jsonLd = generateToolJsonLd("video-screenshot");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoScreenshotClient />
    </>
  );
}
