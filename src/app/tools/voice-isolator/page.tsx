import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";

export const metadata = generateToolMetadata("voice-isolator");

export default function Page() {
  const jsonLd = generateToolJsonLd("voice-isolator");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
    </>
  );
}
