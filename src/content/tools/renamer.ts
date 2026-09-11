import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Batch File Renamer Online – Rename Multiple Files at Once, Free",
  seoDescription:
    "Rename many files at once in your browser: add a prefix, find and replace text, change case, add padded sequence numbers, then download the renamed set as a ZIP. Free, no upload.",
  intro:
    "Rename dozens or hundreds of files in one pass without installing software. Drop the files in, build a naming rule — find-and-replace, prefix, upper/lower/title case, zero-padded numbering — preview every new name before committing, and download the renamed files together as a ZIP. Files are processed on your device and never uploaded.",
  sections: [
    {
      heading: "Renaming rules you can combine",
      bullets: [
        "Find and replace — swap any text in the file name (\"IMG_\" → \"Holiday_\"), including spaces and punctuation.",
        "Prefix — add a project code, date or version to the start of every name.",
        "Case — convert names to lowercase, UPPERCASE, Title Case or leave them unchanged.",
        "Sequence numbers — append 1, 2, 3… or zero-padded 001, 002, 003… so files sort correctly in every file manager.",
        "Extensions are preserved automatically so the files keep opening in the right app.",
      ],
    },
    {
      heading: "Typical batch-rename jobs",
      bullets: [
        "Camera dumps: turn DSC_4821.JPG … into paris-2026-001.jpg … for a client gallery.",
        "Web assets: lowercase everything and replace spaces with hyphens so URLs are clean and case-safe on Linux servers.",
        "Scanned documents: prefix each PDF with the client name or invoice number.",
        "Course materials and podcasts: number episodes with two- or three-digit padding for correct ordering.",
        "Cleaning downloads: strip \"(1)\", \"copy\" and \"final_final\" from a folder of files.",
      ],
    },
    {
      heading: "Why an online renamer instead of the OS",
      paragraphs: [
        "Windows Explorer and macOS Finder can apply simple sequential names, but neither offers find-and-replace with a preview, case conversion and padding together — and PowerShell or shell scripts are error-prone for one-off jobs. This tool shows the old and new names side by side before anything changes, so a typo in a rule never damages your files. Because the originals stay untouched on disk and the renamed copies arrive in a ZIP, the operation is completely reversible.",
      ],
    },
  ],
  howTo: [
    { name: "Add files", text: "Drag any number of files onto the page or click to browse. They are read locally." },
    { name: "Set the rules", text: "Enter find/replace text, a prefix, a case option and a numbering style." },
    { name: "Check the preview", text: "Each file's current and new name is shown side by side. Adjust until every name looks right." },
    { name: "Download", text: "Click Rename & Download to receive a ZIP containing the renamed files." },
  ],
  faqs: [
    {
      question: "Does renaming change the files' contents or quality?",
      answer: "No. Only the names change; the bytes of each file are copied exactly into the ZIP.",
    },
    {
      question: "Are the original files modified?",
      answer:
        "No. Browsers cannot rename files on your disk directly, so you receive renamed copies in a ZIP and the originals remain untouched — which also makes the process risk-free.",
    },
    {
      question: "Can I rename folders or files inside a ZIP?",
      answer:
        "Extract the archive first with the ZIP Extractor, rename the files here, and re-compress with the File Compressor if needed.",
    },
    {
      question: "Is there a limit on the number of files?",
      answer: "No fixed limit; hundreds of files work well. Total size is bounded only by your device's memory because everything is processed locally.",
    },
  ],
  related: ["compressor", "extractor", "slugify", "case-converter", "image-converter", "text-cleaner"],
};

export default content;
