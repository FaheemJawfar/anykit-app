import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoSpeedChangerClient from "./client";

export const metadata = generateToolMetadata("video-speed-changer");

export default function VideoSpeedChanger() {
  const jsonLd = generateToolJsonLd("video-speed-changer");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoSpeedChangerClient />
    </>
  );
}
