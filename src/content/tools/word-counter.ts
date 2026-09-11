import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Word Counter – Count Words, Characters, Sentences & Reading Time",
  seoDescription:
    "Free online word counter. Instantly count words, characters (with and without spaces), sentences, paragraphs and lines, plus estimated reading time. Private — text never leaves your browser.",
  intro:
    "Paste or type text and see live counts for words, characters, sentences, paragraphs and lines, along with an estimated reading time. Use it to hit an essay word limit, keep a meta description under 160 characters, check a tweet or LinkedIn post length, or size a speech. Everything is calculated in your browser as you type — nothing is uploaded or stored.",
  sections: [
    {
      heading: "What gets counted, and how",
      bullets: [
        "Words — sequences of characters separated by whitespace. Hyphenated words count as one; numbers count as words.",
        "Characters — every letter, digit, punctuation mark and space, shown both with and without spaces. Most platform limits (Twitter/X, meta descriptions, SMS) count spaces.",
        "Sentences — text segments ending in a period, question mark or exclamation mark.",
        "Paragraphs — blocks of text separated by a blank line.",
        "Lines — individual line breaks, useful for code, poetry and lists.",
        "Reading time — words ÷ 200, the average adult silent reading speed. Speaking pace for presentations is slower, around 130–150 words per minute.",
      ],
    },
    {
      heading: "Common length limits to check against",
      bullets: [
        "Google title tag: about 50–60 characters before truncation; meta description: 150–160 characters.",
        "X (Twitter) post: 280 characters. LinkedIn post: 3,000 characters, with \"see more\" after about 210.",
        "Instagram caption: 2,200 characters. YouTube title: 100 characters; description: 5,000.",
        "SMS: 160 characters (70 if it contains emoji or non-Latin characters).",
        "College application essays: typically 250–650 words. Blog posts that rank well: often 1,000–2,000+ words.",
        "A 5-minute speech: roughly 650–750 words. A 20-minute talk: about 2,600–3,000 words.",
      ],
    },
    {
      heading: "Why word counts differ between tools",
      paragraphs: [
        "Microsoft Word, Google Docs and various online counters can disagree by a few words on the same text because they treat edge cases differently: whether \"e-mail\" is one word or two, whether standalone numbers or symbols count, how em dashes without spaces are handled, and whether footnotes or headers are included. This counter follows the most common convention — whitespace-separated tokens — which matches Google Docs closely. If you are submitting to a strict limit, leave a small margin.",
      ],
    },
  ],
  howTo: [
    { name: "Paste or type", text: "Enter your text in the editor. You can also paste directly from a document or web page." },
    { name: "Read the statistics", text: "Word, character, sentence, paragraph and line counts update live as you type, with the reading-time estimate." },
    { name: "Edit to fit", text: "Trim or expand your text and watch the numbers change until you hit the target." },
    { name: "Clear or copy", text: "Copy your text back to the clipboard or clear the editor to start over." },
  ],
  faqs: [
    {
      question: "Does the word counter count spaces as characters?",
      answer:
        "Both figures are shown: characters including spaces (which is what most platform limits use) and characters excluding spaces.",
    },
    {
      question: "How is reading time calculated?",
      answer:
        "It divides the word count by 200 words per minute, a standard estimate for adult silent reading of general prose, and rounds up to the nearest minute.",
    },
    {
      question: "Is there a limit on how much text I can paste?",
      answer:
        "No practical limit — book-length manuscripts of 100,000+ words are counted instantly because the calculation runs locally in your browser.",
    },
    {
      question: "Is my text saved or sent anywhere?",
      answer:
        "No. The text stays in your browser tab and is discarded when you leave the page. It is never transmitted to a server.",
    },
    {
      question: "Can I count words in a PDF or Word document?",
      answer:
        "Copy the text from the document and paste it here. For PDFs you can first use the PDF to Text tool to extract the content.",
    },
  ],
  related: ["text-statistics", "readability-analyzer", "case-converter", "text-cleaner", "keywords", "lorem-ipsum"],
};

export default content;
