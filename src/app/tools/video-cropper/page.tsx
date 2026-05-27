import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import VideoCropperClient from "./client";

export const metadata = generateToolMetadata("video-cropper");

export default function VideoCropper() {
  const jsonLd = generateToolJsonLd("video-cropper");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoCropperClient />
    </>
  );
}
