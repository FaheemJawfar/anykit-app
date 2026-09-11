import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Add Blank Page to PDF Online Free – Insert Empty Pages Anywhere",
  seoDescription:
    "Insert a blank page into a PDF at any position — beginning, end or between pages — for free in your browser. Matches the existing page size. No upload, no watermark, no sign-up.",
  intro:
    "Insert an empty page into an existing PDF exactly where you need it: before the first page for a cover, between chapters as a separator, or at the end for notes and signatures. The new page automatically matches the size of the document's pages, so the file stays uniform for printing. Your PDF is edited entirely in your browser and never uploaded.",
  sections: [
    {
      heading: "Why you'd add a blank page",
      bullets: [
        "Duplex printing — make each chapter start on a right-hand page by inserting a blank after odd-length sections.",
        "Signatures and notes — leave an empty page at the end for a wet signature, stamps or handwritten comments.",
        "Placeholders — reserve a spot for a page you will insert later (a scanned form, an appendix, an image).",
        "Merging — separate documents visually before combining them with Merge PDF.",
        "Booklet layouts — bring the total page count to a multiple of four so imposition works correctly.",
      ],
    },
    {
      heading: "How the insertion works",
      paragraphs: [
        "The tool opens the PDF with the pdf-lib library, reads the dimensions of the first page, and creates a new page of the same width and height at the position you choose. Position 1 puts the blank page before everything; a position equal to the page count plus one appends it at the end. All existing pages — their text, images, links, bookmarks and form fields — are copied through unchanged, so there is no quality loss and the document stays searchable.",
      ],
    },
    {
      heading: "Tips",
      bullets: [
        "Check the page count shown after loading so you can target the exact gap you want.",
        "Repeat the operation on the result to add several blank pages at different positions.",
        "To fill the blank page with content later, use the Header & Footer or Add Watermark tools, or open it in any PDF editor.",
        "If the document mixes portrait and landscape pages, the blank page takes the size of page one.",
      ],
    },
  ],
  howTo: [
    { name: "Open your PDF", text: "Drop the file onto the page. Its page count is read locally." },
    { name: "Choose the position", text: "Enter where the blank page should go — 1 for the front, or page count + 1 for the back." },
    { name: "Insert", text: "Click Add Blank Page. The new page is created at the same size as the existing pages." },
    { name: "Download", text: "Save the updated PDF." },
  ],
  faqs: [
    {
      question: "Will the blank page be the same size as the rest of the document?",
      answer: "Yes. It copies the width and height of the first page so A4 documents stay A4 and Letter stays Letter.",
    },
    {
      question: "Can I add more than one blank page?",
      answer: "Run the tool again on the downloaded result for each additional page you need, choosing a new position each time.",
    },
    {
      question: "Does this change or compress the existing pages?",
      answer: "No. Existing pages are copied byte-for-byte into the new document; only the blank page is added.",
    },
    {
      question: "Is my PDF uploaded?",
      answer: "No. The document is modified in your browser and never sent to a server, so it is safe for contracts and private records.",
    },
  ],
  related: ["merge-pdf", "delete-pages", "organize-pdf", "remove-blank-pages", "split-pdf", "page-numbers"],
};

export default content;
