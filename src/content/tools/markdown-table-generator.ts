import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Markdown Table Generator – Build & Format Tables Visually, Free",
  seoDescription:
    "Create Markdown tables without counting pipes. Set rows and columns, type into cells, choose left/centre/right alignment and copy perfectly aligned GitHub-flavoured Markdown. Free online.",
  intro:
    "Building a Markdown table by hand means counting pipes and dashes and re-aligning everything each time a cell changes. This generator gives you a spreadsheet-like grid instead: add rows and columns, type into the cells, pick an alignment per column, and copy clean, evenly padded Markdown that renders correctly on GitHub, GitLab, Notion, Obsidian, Jira, Slack and every static site generator.",
  sections: [
    {
      heading: "Markdown table syntax, briefly",
      paragraphs: [
        "A GitHub-flavoured Markdown table is a header row, a separator row, and data rows, with cells divided by pipes. The separator row controls alignment: --- is left (default), :---: is centre, and ---: is right. Padding spaces are optional — Markdown renderers ignore them — but aligned columns make the source far easier to read in code review and diffs, which is why this tool pads every column to its widest cell.",
      ],
      bullets: [
        "| Name | Qty | Price |",
        "|:-----|:---:|------:|",
        "| Widget | 3 | 9.99 |",
      ],
    },
    {
      heading: "Tips for tables that render everywhere",
      bullets: [
        "Escape a literal pipe inside a cell as \\| so it isn't read as a column boundary.",
        "Tables must have a header row; leave it blank if you don't need one, but the separator row is mandatory.",
        "Line breaks inside cells are not standard — use <br> where the renderer allows HTML (GitHub does).",
        "Keep long content out of tables; wrap wide tables in a scrollable container on your site instead.",
        "Some renderers (older Jira, plain CommonMark) don't support tables at all — check your target.",
      ],
    },
    {
      heading: "Common uses",
      bullets: [
        "README feature matrices, option tables and API parameter lists.",
        "Comparison tables in documentation and blog posts.",
        "Release notes and changelogs with version, date and summary columns.",
        "Meeting notes with owner, action and due-date columns in Obsidian or Notion.",
        "Converting a small spreadsheet range into Markdown for a pull request or issue.",
      ],
    },
  ],
  howTo: [
    { name: "Set the size", text: "Choose the number of rows and columns, or add them as you go." },
    { name: "Fill the cells", text: "Type the header and data directly into the grid." },
    { name: "Set alignment", text: "Choose left, centre or right alignment for each column." },
    { name: "Copy", text: "Copy the generated Markdown and paste it into your document." },
  ],
  faqs: [
    {
      question: "Can I paste data from Excel or Google Sheets?",
      answer:
        "Copy the range from your spreadsheet and paste it into the cells; tab-separated data fills across columns. For large tables, the JSON to CSV tool can help reshape data first.",
    },
    {
      question: "Why does my table not render on GitHub?",
      answer:
        "The most common causes are a missing separator row, a mismatch between the number of header cells and separator cells, or the table not being preceded by a blank line.",
    },
    {
      question: "How do I merge cells or add a caption?",
      answer: "Markdown tables don't support merged cells or captions. Use an HTML <table> for those, or restructure the data.",
    },
    {
      question: "Does the alignment affect how the table displays?",
      answer: "Yes — the colons in the separator row tell the renderer to left-, centre- or right-align each column's text.",
    },
  ],
  related: ["markdown-editor", "markdown-to-html", "markdown-cheatsheet", "combine-markdown", "json-csv", "html-markdown"],
};

export default content;
