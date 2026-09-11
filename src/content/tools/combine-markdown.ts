import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Combine Markdown Files Online – Merge Multiple .md into One",
  seoDescription:
    "Merge several Markdown files into a single document in your browser. Reorder files, choose a separator (horizontal rule, line breaks or none) and download the combined .md. Free, no upload.",
  intro:
    "Join chapters, notes, meeting minutes or documentation pages into one Markdown file. Drop in the .md files, arrange them in the order you want, pick how they should be separated, and download the merged result. Everything is processed in your browser — nothing is uploaded.",
  sections: [
    {
      heading: "When you need to merge Markdown",
      bullets: [
        "Turning a folder of per-chapter files into a single manuscript for Pandoc, a PDF export or an e-book.",
        "Assembling a project's scattered docs into one README or handbook.",
        "Combining daily notes from Obsidian, Logseq or Bear into a weekly or monthly summary.",
        "Collecting several contributors' sections into one document for review.",
        "Preparing one long file to paste into an LLM, a wiki, or a CMS that accepts a single Markdown field.",
      ],
    },
    {
      heading: "Choosing a separator",
      bullets: [
        "Horizontal rule (--- or ***) — renders as a visible divider; ideal between chapters or unrelated notes.",
        "Double line break — a clean paragraph gap with no visual rule; best when the files already start with headings.",
        "Single line break — tight joining for fragments that continue each other.",
        "No separator — for files that already end with the spacing you want, or when concatenating code-block-only files.",
      ],
    },
    {
      heading: "Tips for a clean combined document",
      paragraphs: [
        "Make sure each file begins with a heading at a consistent level (for example ## for chapters) so the merged document has a sensible outline. Front matter blocks (the --- YAML at the top of some files) will appear in the body when combined; strip them first or place the file with front matter first. If relative image paths differ between the source folders, adjust them before merging. After combining, open the result in the Markdown Editor to check the rendered preview, or convert it with Markdown to HTML.",
      ],
    },
  ],
  howTo: [
    { name: "Add files", text: "Drop two or more .md (or .txt) files onto the page." },
    { name: "Order them", text: "Arrange the files in the sequence they should appear in the final document." },
    { name: "Choose a separator", text: "Pick a horizontal rule, double or single line break, or no separator." },
    { name: "Download", text: "Click Combine and save the merged Markdown file." },
  ],
  faqs: [
    {
      question: "Does combining change the Markdown syntax inside my files?",
      answer: "No. File contents are concatenated exactly as written; only the separator you choose is added between them.",
    },
    {
      question: "Can I combine files from different folders with images?",
      answer:
        "Yes, but image links are kept as written. If the files used relative paths to different folders, update the paths afterwards so they resolve from the merged file's location.",
    },
    {
      question: "Is there a limit to the number or size of files?",
      answer: "No practical limit — the merge is done in memory in your browser, so hundreds of files and multi-megabyte documents are fine.",
    },
    {
      question: "Are my files uploaded?",
      answer: "No. They are read and joined locally; nothing leaves your device.",
    },
  ],
  related: ["markdown-editor", "markdown-to-html", "markdown-table-generator", "markdown-cheatsheet", "text-cleaner", "merge-pdf"],
};

export default content;
