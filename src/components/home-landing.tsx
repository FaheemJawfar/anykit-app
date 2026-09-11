import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools, categories, getToolsByCategory, getToolById, type Tool } from "@/lib/tools";
import { getCategoryContent } from "@/content/categories";
import { ToolCard } from "@/components/tool-card";
import { LucideIcon } from "@/components/lucide-icon";

const PREVIEW_COUNT = 5;

// Tools with the strongest search demand (from Search Console) — surfaced on
// the homepage so they receive direct internal links from the highest-authority URL.
const POPULAR_TOOL_IDS = [
  "iban-validator",
  "color-name-finder",
  "video-speed-changer",
  "barcode-generator",
  "word-counter",
  "audio-converter",
  "aspect-ratio",
  "markdown-editor",
  "image-cropper",
  "video-trimmer",
  "json-formatter",
  "qr-generator",
];

const HOME_FAQS = [
  {
    question: "Are the tools really free?",
    answer:
      "Yes. Every tool on AnyKit is free to use with no account, no trial period, no watermarks and no usage caps.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. Files and text are processed inside your browser with JavaScript and WebAssembly. Nothing is transmitted to AnyKit or any third party, which is why there are no file-size limits and nothing to delete afterwards.",
  },
  {
    question: "Do the tools work offline?",
    answer:
      "Once a tool page has loaded it keeps working without a connection. Audio and video tools download the FFmpeg engine the first time they run and cache it for later use.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "Current versions of Chrome, Edge, Firefox and Safari on desktop and mobile. Heavier audio, video and PDF tasks run fastest on a desktop computer.",
  },
];

export function HomeLanding() {
  const popular = POPULAR_TOOL_IDS.map((id) => getToolById(id)).filter((t): t is Tool => !!t);

  return (
    <>
      <section className="space-y-3">
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground">
          Free online tools that run in your browser
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          AnyKit is a collection of {tools.length} free utilities for developers, designers, students and everyday
          work — PDF, image, audio and video editors, converters, calculators, generators, text and SEO tools —
          organised into {categories.length} categories. Everything runs locally on your device: no sign-up, no
          uploads, no watermarks and no file-size limits.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="text-sm font-semibold tracking-tight text-foreground">
          Most popular tools
        </h2>
        <ul className="flex flex-wrap gap-2">
          {popular.map((t) => (
            <li key={t.id}>
              <Link
                href={t.path}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <LucideIcon name={t.icon} className="w-3.5 h-3.5" />
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-10">
        {categories.map((category) => {
          const catTools = getToolsByCategory(category.id);
          const preview = catTools.slice(0, PREVIEW_COUNT);
          const remaining = catTools.length - preview.length;
          const tagline = getCategoryContent(category.id)?.tagline;
          return (
            <section key={category.id} className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2">
                <Link href={`/category/${category.id}`} className="group flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary shrink-0">
                    <LucideIcon name={category.icon} className="w-3.5 h-3.5" />
                  </span>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                    {category.name}
                  </h2>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">{catTools.length}</span>
                </Link>
                <Link
                  href={`/category/${category.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  View all
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {tagline && <p className="text-xs text-muted-foreground -mt-1">{tagline}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {preview.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>

              {remaining > 0 && (
                <Link
                  href={`/category/${category.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Show {remaining} more in {category.name}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </section>
          );
        })}
      </div>

      <section className="pt-6 border-t border-border/60 space-y-6">
        <div className="space-y-3 max-w-3xl">
          <h2 className="text-lg font-bold tracking-tight">Why AnyKit</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most online tools upload your file to a server, process it there, and hand back a link — which means
            waiting in a queue, hitting size limits, and trusting a stranger with your documents. AnyKit takes the
            opposite approach. Every tool is built with browser technologies (JavaScript, WebAssembly, the Canvas
            and Web Audio APIs, FFmpeg and pdf-lib compiled to run client-side) so the work happens on your own
            machine. Your PDFs, photos, recordings and pasted text never leave your device.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The result is a toolbox that is fast, private and honest: no accounts, no ads between you and the
            result, no watermarks on your exports, and no artificial caps to push you towards a paid plan. Whether you
            need to validate an IBAN, trim a video, normalise a podcast to -16 LUFS, crop a PDF or find the name of
            a colour, the tool is one click away and works the same on a laptop, tablet or phone.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-tight">Frequently asked questions</h2>
          <dl className="grid gap-3 md:grid-cols-2">
            {HOME_FAQS.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border/60 bg-card/60 p-4">
                <dt className="text-sm font-semibold">{faq.question}</dt>
                <dd className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

export { HOME_FAQS };
