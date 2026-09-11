import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("password-generator");

export default function Page() {
  const jsonLd = generateToolJsonLd("password-generator");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
      <ToolSeoContent toolId="password-generator" />
    </>
  );
}
