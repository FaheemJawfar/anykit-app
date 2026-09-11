import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("web-vitals");

export default function Page() {
  const jsonLd = generateToolJsonLd("web-vitals");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
      <ToolSeoContent toolId="web-vitals" />
    </>
  );
}
