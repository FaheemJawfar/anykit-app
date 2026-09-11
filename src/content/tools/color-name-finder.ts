import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Color Name Finder – Identify Any Hex Color's Name Instantly",
  seoDescription:
    "Find the name of any color from its hex code. Pick or paste a colour and instantly get the closest CSS named colour, its hex value and the nearest alternatives. Free, no sign-up.",
  intro:
    "Ever had a hex code like #3F51B5 and wondered what to call it? Paste it or use the colour picker and this tool tells you the closest named colour — along with its exact hex value and the next nearest matches — so you can name design tokens, describe colours to clients, or find the standard CSS keyword that approximates a brand colour.",
  sections: [
    {
      heading: "How the colour name is chosen",
      paragraphs: [
        "The finder compares your colour against all 148 named colours defined in the CSS Color specification (the same keywords every browser understands, such as cornflowerblue, tomato, slategray and rebeccapurple). It measures the distance from your colour to each named colour in RGB space and returns the ones with the smallest difference.",
        "Because the match is by nearest distance, you will always get a result even for colours that have no exact keyword. When the distance is zero the hex values are identical and you can safely use the CSS keyword in place of the hex code.",
      ],
    },
    {
      heading: "Why colour names matter",
      bullets: [
        "Design systems — naming a palette \"Cornflower 500\" is more meaningful to a team than \"#6495ED\".",
        "Accessibility and documentation — screen readers, style guides and alt text benefit from human-readable colour descriptions.",
        "CSS shorthand — a named colour is often shorter and clearer in a stylesheet than a hex triplet.",
        "Client communication — \"a slightly darker steel blue\" is easier to discuss than raw numbers.",
      ],
    },
    {
      heading: "Tips for getting a better match",
      paragraphs: [
        "Named colours cluster heavily around a few hues (there are many greys, blues and pinks, but relatively few oranges and browns), so some inputs will return a match that is visually further away than others. Compare the swatches side by side; if the nearest name is not close enough, the Color Converter can give you the exact HSL or OKLCH values to describe the colour precisely instead. For colour comparisons that better reflect how humans perceive difference, the Color Distance tool calculates Delta E in the LAB colour space.",
      ],
    },
  ],
  howTo: [
    { name: "Enter a colour", text: "Use the visual picker or type a hex code such as #FF7F50 into the text field." },
    { name: "Read the closest match", text: "The nearest CSS named colour appears immediately with its hex code and a swatch for visual comparison." },
    { name: "Check the alternatives", text: "Review the next-closest names if you want a lighter, darker or more saturated option that still has a standard name." },
    { name: "Copy", text: "Copy the hex code or the colour name to use in your CSS, design tool or documentation." },
  ],
  faqs: [
    {
      question: "How many colour names does the finder know?",
      answer:
        "All 148 named colours from the CSS Color Module specification, from the basic sixteen (red, blue, gray, etc.) to extended names like lightgoldenrodyellow, mediumaquamarine and rebeccapurple. Because these are standard CSS keywords, every match can be used directly in a stylesheet.",
    },
    {
      question: "Can I find a colour name from an image?",
      answer:
        "Use the Color Palette Extractor to pull the dominant colours from an image first, then paste the hex value here to get its name.",
    },
    {
      question: "Does the tool work with RGB or HSL values?",
      answer:
        "The input accepts hex codes. If you have RGB, HSL, LAB or OKLCH values, convert them to hex with the Color Converter tool and paste the result.",
    },
    {
      question: "Why is the closest name visually different from my colour?",
      answer:
        "Named colours are unevenly spread across the spectrum, so a colour in a sparse region (for example a muted orange-brown) may have no keyword within a small distance. The tool always shows the nearest option and its hex code so you can judge how close the match is.",
    },
  ],
  related: ["color-converter", "color-distance", "color-palette", "color-harmony", "contrast-checker", "color-mixer"],
};

export default content;
