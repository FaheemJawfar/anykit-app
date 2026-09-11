import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Make a PDF Look Scanned Online – Free Scanner Effect for PDFs",
  seoDescription:
    "Give any PDF a realistic scanned look: subtle rotation, grayscale, noise, blur and contrast adjustments, page by page. Free, private and browser-based — no upload, no watermark.",
  intro:
    "Turn a crisp digital PDF into something that looks like it went through a real office scanner — slightly rotated pages, paper grain, softened edges, tuned contrast and optional grayscale. Useful when a form must appear hand-processed, when you want a digitally signed contract to match the rest of a scanned bundle, or for realistic mock-ups and test data. The PDF is rendered and rebuilt entirely in your browser.",
  sections: [
    {
      heading: "What the effect does to each page",
      bullets: [
        "Rotation — a random tilt of a degree or two per page, the tell-tale sign of paper fed through a scanner.",
        "Grayscale — converts colour to shades of grey, as most document scanners are set to do by default.",
        "Noise — adds fine paper grain and sensor speckle so flat white areas look like paper rather than a vector fill.",
        "Blur — softens the razor-sharp edges of digital text to mimic optical resolution.",
        "Brightness and contrast — reproduce the slightly washed-out or heavy-black look of different scanner settings.",
        "JPEG compression — pages are re-encoded as photographs, exactly as a scanner would output them.",
      ],
    },
    {
      heading: "How it works",
      paragraphs: [
        "Each page is rasterised with PDF.js at a chosen DPI, drawn to a canvas where the transformations are applied, compressed to JPEG, and placed into a fresh PDF with pdf-lib. Because the output is image-based, the original text layer is not carried over — which is also how genuine scans behave. If you need the result to remain searchable, run it through an OCR step afterwards.",
      ],
    },
    {
      heading: "Tips for a convincing result",
      bullets: [
        "Keep rotation small (0.5–1.5°); real scans are rarely more crooked than that.",
        "Use light noise and a touch of blur together — either one alone looks artificial.",
        "Slightly increase contrast for the classic photocopier look, or lower brightness a little for an older scanner.",
        "Sign the PDF first with the Sign PDF tool so the signature is scanned along with the page.",
        "Compress the output with Compress PDF if the file needs to be emailed.",
      ],
    },
  ],
  howTo: [
    { name: "Open the PDF", text: "Drop your document onto the page. Pages are rendered locally for preview." },
    { name: "Tune the effect", text: "Adjust rotation, grayscale, noise, blur, brightness and contrast while watching the live preview." },
    { name: "Apply", text: "Click Apply to process every page." },
    { name: "Download", text: "Save the scanned-looking PDF." },
  ],
  faqs: [
    {
      question: "Will the text still be selectable in the output?",
      answer:
        "No. Like a real scan, the output pages are images. That is part of what makes it look authentic; use an OCR tool afterwards if you need searchable text.",
    },
    {
      question: "Does it work on colour documents?",
      answer: "Yes. Leave grayscale off to keep colours with the added grain and tilt, or turn it on for a black-and-white scan look.",
    },
    {
      question: "How large will the output file be?",
      answer:
        "Because pages become JPEG images, file size depends on page count and DPI — typically 100–300 KB per page at standard settings. Lower the DPI or use Compress PDF for smaller files.",
    },
    {
      question: "Is my document uploaded?",
      answer: "No. Rendering, effects and PDF assembly all happen in your browser.",
    },
  ],
  related: ["sign-pdf", "compress-pdf", "adjust-colors", "invert-colors", "jpg-to-pdf", "add-watermark"],
};

export default content;
