import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";

export const metadata = generateToolMetadata("audio-resampler");

export default function Page() {
  const jsonLd = generateToolJsonLd("audio-resampler");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
    </>
  );
}
