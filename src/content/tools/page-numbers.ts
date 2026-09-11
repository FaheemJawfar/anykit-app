import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Add Page Numbers to PDF Online Free – Choose Position, Start & Format",
  seoDescription:
    "Insert page numbers into any PDF in your browser. Pick top or bottom, left, centre or right, set the starting number, font size and a prefix/suffix like \"Page 1 of\". Free, no upload, no watermark.",
  intro:
    "Add page numbers to a PDF that doesn't have them — a merged report, scanned document, exported slide deck or a manuscript for review. Choose where the numbers sit, what number to start from, the font size, and any text around the number (for example \"Page \" before or \" | Draft\" after). The numbers are drawn directly into the PDF on your device, and the file is never uploaded.",
  sections: [
    {
      heading: "Options",
      bullets: [
        "Position — top or bottom, aligned left, centre or right. Bottom centre is the convention for reports; top right (or outer edge) for books and long documents.",
        "Start number — begin at 1, or at any number if the document continues from a previous file or has an unnumbered cover.",
        "Prefix and suffix — add text before and after the number: \"Page 3\", \"3 / Appendix\", \"— 3 —\".",
        "Font size — 8–10 pt is discreet, 12 pt matches most body text.",
      ],
    },
    {
      heading: "Common scenarios",
      bullets: [
        "Merged PDFs — after combining several documents, the original numbers no longer make sense; add a continuous sequence.",
        "Scanned paperwork — contracts and forms often lose their numbering when scanned; add them back for referencing in review.",
        "Legal and academic submissions — many courts and journals require every page to be numbered.",
        "Printed handouts — numbers help audiences follow along and reassemble dropped pages.",
        "Multi-part documents — set the start number so part two continues from part one.",
      ],
    },
    {
      heading: "How the numbers are added",
      paragraphs: [
        "Each page's dimensions are read with pdf-lib and the number is drawn as real text (not an image) at the chosen margin position using the standard Helvetica font, so it stays crisp at any zoom and is searchable and selectable. Existing content is untouched. If a page already has a footer in the same spot, choose a different position to avoid overlap, or run Crop PDF first to remove old headers and footers.",
      ],
    },
  ],
  howTo: [
    { name: "Open the PDF", text: "Drop your document onto the page. It is loaded locally." },
    { name: "Set the options", text: "Choose position, starting number, font size and any prefix or suffix text." },
    { name: "Add numbers", text: "Click Add Page Numbers to stamp every page." },
    { name: "Download", text: "Save the numbered PDF." },
  ],
  faqs: [
    {
      question: "Can I skip the cover page?",
      answer:
        "Split the cover off with Split PDF, number the remaining pages starting from 2 (or 1), and merge them back with Merge PDF.",
    },
    {
      question: "Can I use \"Page X of Y\" format?",
      answer: "Set the prefix to \"Page \" and the suffix to \" of N\" where N is the document's page count shown after loading.",
    },
    {
      question: "Will the numbers be searchable and selectable?",
      answer: "Yes. They are added as text objects, not images, so they behave like any other text in the PDF.",
    },
    {
      question: "Is my PDF uploaded?",
      answer: "No. The document is modified in your browser and never sent to a server.",
    },
  ],
  related: ["header-footer", "add-watermark", "merge-pdf", "split-pdf", "crop-pdf", "add-page-labels"],
};

export default content;
