import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Remove Blank Pages from PDF Online Free – Auto-Detect Empty Pages",
  seoDescription:
    "Automatically find and delete blank pages from scanned PDFs. Adjustable sensitivity handles scanner noise and faint marks. Free, private — the PDF is processed in your browser, never uploaded.",
  intro:
    "Scanned a double-sided stack and ended up with dozens of empty pages? This tool renders every page, measures how much of it is non-white, and removes the ones that are effectively blank — with a sensitivity slider so you can decide whether a page with a faint scanner shadow or a single punch-hole mark counts as empty. Review the result and download a clean PDF. Nothing leaves your device.",
  sections: [
    {
      heading: "How blank pages are detected",
      paragraphs: [
        "Each page is rasterised with PDF.js and its pixels are analysed: the tool counts how many are darker than near-white and expresses that as a percentage of the page. A page whose non-white area is below the threshold is marked blank. The sensitivity slider sets that threshold — at low sensitivity only perfectly clean pages are removed; at high sensitivity pages with light noise, bleed-through from the reverse side, or a stray staple mark are removed too. The kept pages are then copied unchanged into a new PDF with pdf-lib, so text, images and links are preserved exactly.",
      ],
    },
    {
      heading: "Where blank pages come from",
      bullets: [
        "Duplex scanning of single-sided originals — every other page is the empty reverse.",
        "Chapter breaks in books and reports that force new sections onto odd pages.",
        "Separator sheets used to batch documents through a feeder.",
        "Print-to-PDF jobs that emit a trailing empty page.",
        "Forms with an intentionally blank notes page that is not needed in the digital copy.",
      ],
    },
    {
      heading: "Tuning the sensitivity",
      bullets: [
        "Start at the default and check the page count before and after.",
        "If genuine blank pages survive, raise the sensitivity — scanner shading often makes \"blank\" pages 1–2% grey.",
        "If pages with a small amount of real content vanish (a page number only, a short signature), lower it.",
        "For pages with a dark border from the scanner bed, run Crop PDF first so the border is not counted as content.",
        "To remove specific pages by number instead, use Delete Pages.",
      ],
    },
  ],
  howTo: [
    { name: "Open the PDF", text: "Drop the scanned document onto the page. It is processed locally." },
    { name: "Set the sensitivity", text: "Adjust how aggressively near-empty pages are treated as blank." },
    { name: "Detect and remove", text: "Click Remove Blank Pages. The tool reports how many pages were removed." },
    { name: "Download", text: "Save the cleaned PDF and spot-check it in your viewer." },
  ],
  faqs: [
    {
      question: "Will it remove pages that only have a page number or a small logo?",
      answer:
        "At high sensitivity it might, because those pages are almost entirely white. Lower the sensitivity so only pages with less content than that are removed, or use Delete Pages for manual control.",
    },
    {
      question: "Does it change the remaining pages?",
      answer: "No. Kept pages are copied exactly as they were — no re-compression, no loss of text or image quality.",
    },
    {
      question: "How long does it take?",
      answer: "Each page must be rendered to analyse it, so expect roughly 0.1–0.3 seconds per page on a modern computer; a 200-page scan finishes in under a minute.",
    },
    {
      question: "Is my document uploaded?",
      answer: "No. Rendering, analysis and rebuilding all happen in your browser.",
    },
  ],
  related: ["delete-pages", "crop-pdf", "organize-pdf", "compress-pdf", "scanner-effect", "split-pdf"],
};

export default content;
