import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Emoji Picker – Search, Browse & Copy Emojis Online (Free)",
  seoDescription:
    "Find and copy any emoji in one click. Search by name or keyword, browse by category, and paste into social posts, messages, code or documents. Works on any device, no app needed.",
  intro:
    "Search for an emoji by name or keyword, browse by category, click to copy, and paste it anywhere — tweets, commit messages, Slack, emails, documents or code. Handy when you are on a desktop without an emoji keyboard, when you need the exact emoji the platform expects, or when you just cannot remember what the smiling-cat one is called.",
  sections: [
    {
      heading: "Why use an online emoji picker?",
      bullets: [
        "Desktop shortcuts are inconsistent — Windows uses Win + . , macOS uses Ctrl + Cmd + Space, and Linux varies by desktop environment. A web picker works the same everywhere.",
        "Search by meaning, not just name: type \"celebrate\" and find 🎉, 🥳 and 🎊 together.",
        "Copy the real Unicode character, not an image — it renders in the recipient's native emoji style and stays accessible to screen readers.",
        "Browse full categories when you want to pick the best option rather than the first one that comes to mind.",
      ],
    },
    {
      heading: "How emoji work under the hood",
      paragraphs: [
        "Every emoji is one or more Unicode code points — 🎉 is U+1F389, for example. Flags are pairs of regional indicator letters, skin tones are added with modifier characters, and family or profession emoji are built by joining several emoji with a zero-width joiner. Because they are plain text, they can be used in filenames, URLs, git commits and source code, though how they look depends on the fonts installed on the viewer's device: Apple, Google, Microsoft and Samsung each draw the same code point differently.",
        "If an emoji shows as an empty box, the viewer's system is too old to include it; the Unicode Consortium adds new emoji roughly once a year and operating systems catch up over the following months. Stick to well-established emoji for maximum compatibility in emails and older devices.",
      ],
    },
    {
      heading: "Emoji etiquette for work and marketing",
      bullets: [
        "In subject lines and titles, one emoji at the start can lift open rates; more than one usually hurts.",
        "In commit messages and changelogs, teams often adopt a convention (for example ✨ for features, 🐛 for bug fixes) — keep it consistent.",
        "Check the meaning across cultures before using hand gestures in international communications.",
        "For accessibility, avoid replacing words with emoji mid-sentence; screen readers read out the emoji name.",
      ],
    },
  ],
  howTo: [
    { name: "Search or browse", text: "Type a keyword such as \"heart\", \"rocket\" or \"thumbs\" — or click a category tab to browse." },
    { name: "Click to copy", text: "Click any emoji and it is copied to your clipboard instantly." },
    { name: "Paste", text: "Paste it into your message, post, document or code editor." },
  ],
  faqs: [
    {
      question: "Why does the emoji look different after I paste it?",
      answer:
        "Emoji are text characters and each platform draws them with its own font. The same 😀 looks different on iPhone, Android, Windows and in Slack — the meaning is preserved but the design varies.",
    },
    {
      question: "Can I use emoji in file names, URLs and code?",
      answer:
        "Yes, they are valid Unicode text. In URLs they are percent-encoded automatically; in code, most languages accept them in strings, and some (like Swift) even allow them in identifiers.",
    },
    {
      question: "How do I type emoji on a computer without this tool?",
      answer:
        "Windows: press Win + . (period). macOS: press Ctrl + Cmd + Space. Chrome OS: press Search + Shift + Space. This picker is useful when those shortcuts are unavailable or when you want to search by meaning.",
    },
    {
      question: "Are new emoji included?",
      answer:
        "The picker covers the standard Unicode emoji set. Whether the newest additions display correctly depends on your operating system's emoji font version.",
    },
  ],
  related: ["text-unicode", "html-entities", "ascii-text-drawer", "case-converter", "lorem-ipsum", "slugify"],
};

export default content;
