import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";

export const metadata = generateToolMetadata("audio-effects-studio");

export default function Page() {
  const jsonLd = generateToolJsonLd("audio-effects-studio");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
    </>
  );
}
