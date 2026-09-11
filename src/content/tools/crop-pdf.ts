import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Crop PDF Online Free – Trim Margins & Whitespace from PDF Pages",
  seoDescription:
    "Crop PDF pages online for free. Trim top, bottom, left and right margins from every page to remove whitespace, fit e-readers or tidy scans. Private — your PDF never leaves your browser.",
  intro:
    "Remove unwanted margins, headers, footers or scanner borders from a PDF by trimming a set amount from each edge of every page. Ideal for making academic papers readable on a Kindle or tablet, cleaning up scanned documents, or cutting a slide deck's border before printing. The file is processed entirely on your device and never uploaded.",
  sections: [
    {
      heading: "How PDF cropping works",
      paragraphs: [
        "A PDF page has several rectangular boundaries; the two that matter for cropping are the media box (the full physical page) and the crop box (the region viewers display and printers print). This tool sets both boxes to your new dimensions, so the trimmed area disappears in every PDF reader and when printing — not just in viewers that respect the crop box. Because the operation only rewrites page geometry, the text, vectors and images inside remain intact and fully searchable; nothing is rasterised or re-compressed.",
      ],
    },
    {
      heading: "Common reasons to crop a PDF",
      bullets: [
        "E-readers and tablets — removing wide margins lets the text fill a small screen without zooming on each page.",
        "Scanned documents — cut off black borders, punch holes and skewed edges from the scanner bed.",
        "Two-column papers — crop to one column at a time for easier mobile reading.",
        "Presentations — trim the branded border from exported slides before embedding them.",
        "Print layout — trim bleed or crop marks from a print-ready file to get a clean preview.",
        "Privacy — remove a header or footer that contains a name, address or watermark text.",
      ],
    },
    {
      heading: "Tips for accurate results",
      bullets: [
        "Values are in PDF points; 72 points = 1 inch = 25.4 mm, so 36 pt trims half an inch.",
        "Check the first and last pages after cropping — title pages and appendices often have different layouts.",
        "Crop a copy; the operation permanently changes the visible page area in the output file.",
        "For pages with different sizes or orientations, split the PDF first with Split PDF, crop each part, then merge with Merge PDF.",
        "To reduce file size after cropping, run the result through Compress PDF.",
      ],
    },
  ],
  howTo: [
    { name: "Open the PDF", text: "Drop your PDF onto the page or click to select it. It is loaded locally in your browser." },
    { name: "Set the margins", text: "Enter how much to trim from the top, bottom, left and right edges in points." },
    { name: "Crop", text: "Click Crop PDF. The new page boundaries are applied to every page." },
    { name: "Download", text: "Save the cropped PDF and check it in your reader." },
  ],
  faqs: [
    {
      question: "Does cropping delete the content outside the crop area?",
      answer:
        "The content is hidden by the new page boundaries rather than physically erased. It will not display or print, but a determined user with PDF editing software could restore the boundaries. For true redaction, use a dedicated redaction tool.",
    },
    {
      question: "Will the text still be selectable and searchable after cropping?",
      answer: "Yes. Only the page dimensions change; the text layer, fonts and images are left exactly as they were.",
    },
    {
      question: "Can I crop different amounts on different pages?",
      answer:
        "This tool applies the same margins to every page. To crop pages differently, split the document into sections, crop each, and merge them back together.",
    },
    {
      question: "Is my PDF uploaded?",
      answer: "No. The cropping is done in your browser with the pdf-lib library; the file never leaves your device.",
    },
    {
      question: "How do I convert millimetres to points?",
      answer: "Multiply millimetres by 2.835 (there are 72 points in an inch and 25.4 mm in an inch). For example, a 10 mm margin is about 28 points.",
    },
  ],
  related: ["split-pdf", "merge-pdf", "compress-pdf", "rotate-pdf", "remove-blank-pages", "delete-pages"],
};

export default content;
