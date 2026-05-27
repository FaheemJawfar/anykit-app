import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import GifToVideoClient from "./client";

export const metadata = generateToolMetadata("gif-to-video");

export default function GifToVideo() {
  const jsonLd = generateToolJsonLd("gif-to-video");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GifToVideoClient />
    </>
  );
}
