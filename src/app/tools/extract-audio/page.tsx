import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import ExtractAudioClient from "./client";

export const metadata = generateToolMetadata("extract-audio");

export default function ExtractAudio() {
  const jsonLd = generateToolJsonLd("extract-audio");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExtractAudioClient />
    </>
  );
}
