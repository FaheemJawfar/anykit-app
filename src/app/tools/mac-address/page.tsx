import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("mac-address");

export default function Page() {
  const jsonLd = generateToolJsonLd("mac-address");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
      <ToolSeoContent toolId="mac-address" />
    </>
  );
}
