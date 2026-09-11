import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("bip39");

export default function Page() {
  const jsonLd = generateToolJsonLd("bip39");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
      <ToolSeoContent toolId="bip39" />
    </>
  );
}
