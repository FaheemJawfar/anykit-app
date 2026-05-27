import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";

export const metadata = generateToolMetadata("chapter-splitter");

export default function Page() {
  const jsonLd = generateToolJsonLd("chapter-splitter");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
    </>
  );
}
