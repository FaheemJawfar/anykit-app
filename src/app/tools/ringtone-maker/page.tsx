import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";

export const metadata = generateToolMetadata("ringtone-maker");

export default function Page() {
  const jsonLd = generateToolJsonLd("ringtone-maker");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
    </>
  );
}
