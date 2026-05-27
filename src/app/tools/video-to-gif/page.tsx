import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoToGifClient from "./client";

export const metadata = generateToolMetadata("video-to-gif");

export default function VideoToGif() {
  const jsonLd = generateToolJsonLd("video-to-gif");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoToGifClient />
    </>
  );
}
