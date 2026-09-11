import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Tip Calculator – Calculate Tip & Split the Bill Between People",
  seoDescription:
    "Free tip calculator: enter the bill, pick 15%, 18%, 20% or a custom percentage, and split the total between any number of people. Instant results, no ads, works on any phone.",
  intro:
    "Enter the bill amount, choose a tip percentage — the common 15%, 18% and 20% presets or any custom value — and see the tip, the total, and the amount each person owes when splitting among a group. Works instantly on your phone at the table.",
  sections: [
    {
      heading: "How much should you tip?",
      bullets: [
        "United States & Canada — 15% is the baseline for table service, 18–20% is standard for good service, 20%+ for exceptional service or large groups. Tip on the pre-tax amount if you prefer, though many people simply tip on the total.",
        "Bars — $1–2 per drink or 15–20% of the tab.",
        "Food delivery — 10–15% with a $3–5 minimum; ride-hailing 10–20%.",
        "UK — 10–12.5% in restaurants, often added as a service charge; check the bill before adding more.",
        "Most of Europe — service is usually included; rounding up or leaving 5–10% is a courtesy, not an obligation.",
        "Japan, South Korea, China — tipping is not customary and may be declined.",
      ],
    },
    {
      heading: "Splitting the bill fairly",
      paragraphs: [
        "An even split is simplest: total including tip divided by the number of people. When orders differ widely, split the tip proportionally — each person tips the same percentage on their own share — or have one person cover the tip while others cover the tax. Rounding each share up to the nearest dollar avoids fiddling with coins and slightly favours the server.",
      ],
    },
    {
      heading: "Quick mental-math tips",
      bullets: [
        "10% — move the decimal point one place left ($48.00 → $4.80).",
        "20% — double the 10% figure ($9.60).",
        "15% — 10% plus half of that ($4.80 + $2.40 = $7.20).",
        "18% — 20% minus a tenth of it ($9.60 − $0.96 ≈ $8.64).",
      ],
    },
  ],
  howTo: [
    { name: "Enter the bill", text: "Type the total from the receipt." },
    { name: "Choose a tip", text: "Tap 15%, 18% or 20%, or enter a custom percentage." },
    { name: "Set the party size", text: "Enter how many people are splitting the bill." },
    { name: "Read the results", text: "See the tip, grand total and per-person amount." },
  ],
  faqs: [
    {
      question: "Should I tip on the pre-tax or post-tax amount?",
      answer:
        "Etiquette guides say pre-tax is acceptable; in practice most people tip on the total shown, and the difference is small. Enter whichever amount you prefer as the bill.",
    },
    {
      question: "How do I calculate 20% of a bill quickly?",
      answer: "Find 10% by moving the decimal one place left, then double it. For $63.50: 10% is $6.35, so 20% is $12.70.",
    },
    {
      question: "What if service charge is already included?",
      answer: "A service charge is a tip. You are not expected to add more unless service was outstanding; enter 0% or a small custom percentage.",
    },
    {
      question: "Does the calculator work offline?",
      answer: "Yes. Once the page has loaded, all calculations run on your device, so it works in a restaurant with poor signal.",
    },
  ],
  related: ["percentage-calculator", "salary-calculator", "calculator", "fraction-calculator", "unit-converter", "date-calculator"],
};

export default content;
