import { generateToolMetadata } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import MuteVideoClient from "./client";

export const metadata = generateToolMetadata("mute-video");

export default function MuteVideo() {
  const jsonLd = generateToolJsonLd("mute-video");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MuteVideoClient />
    </>
  );
}
