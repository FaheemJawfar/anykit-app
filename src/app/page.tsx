import HomeClient from "./home-client";
import { HomeLanding, HOME_FAQS } from "@/components/home-landing";
import { JsonLd } from "@/components/json-ld";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anykit.app";

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/#faq`,
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <HomeClient landing={<HomeLanding />} />
    </>
  );
}
