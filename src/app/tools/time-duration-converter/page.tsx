import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import ClientPage from "./client";
import { ToolSeoContent } from "@/components/tool-seo-content";

export const metadata = generateToolMetadata("time-duration-converter");

export default function Page() {
  const jsonLd = generateToolJsonLd("time-duration-converter");
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientPage />
      <ToolSeoContent toolId="time-duration-converter" />
    </>
  );
}
