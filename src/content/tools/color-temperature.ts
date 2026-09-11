import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Color Temperature to RGB / HEX Converter – Kelvin to Color Online",
  seoDescription:
    "Convert a colour temperature in Kelvin (1000K–12000K) to its RGB and HEX colour. See what candlelight, tungsten, daylight and overcast sky look like as CSS colours. Free tool.",
  intro:
    "Slide from 1000 K to 12000 K and see the colour of light at that temperature — the warm orange of a candle, the yellow-white of a household bulb, the neutral white of noon daylight, the blue of an overcast sky — as an on-screen swatch with its HEX code ready to copy. Useful for lighting design, photo and video colour grading, UI themes that mimic natural light, and understanding what the Kelvin number on a bulb box actually means.",
  sections: [
    {
      heading: "What colour temperature means",
      paragraphs: [
        "Colour temperature describes the hue of a light source by comparison with an ideal black-body radiator heated to that temperature in Kelvin. Counter-intuitively, low temperatures are \"warm\" (red-orange) and high temperatures are \"cool\" (blue-white), because a piece of metal glows red before it glows white-hot and then bluish. The scale is used for light bulbs, camera white balance, monitor calibration and stage lighting.",
      ],
    },
    {
      heading: "Reference temperatures",
      bullets: [
        "1,800–1,900 K — candle flame, deep orange.",
        "2,700 K — incandescent \"warm white\" bulb; the standard cosy living-room light.",
        "3,000–3,200 K — halogen and tungsten studio lamps.",
        "4,000 K — \"cool white\" or \"neutral\" LED, common in kitchens and offices.",
        "5,000–5,500 K — direct midday sunlight and \"daylight\" bulbs; the reference for photography (D55).",
        "6,500 K — overcast daylight and the sRGB / monitor standard white point (D65).",
        "7,000–10,000 K — clear blue sky, heavy shade; distinctly blue.",
      ],
    },
    {
      heading: "How the conversion works",
      paragraphs: [
        "The tool uses Tanner Helland's widely adopted approximation, which fits polynomial and logarithmic curves to the black-body locus and returns sRGB values for temperatures from 1,000 K to 40,000 K. It is accurate to within a few RGB units across the everyday range — plenty for design and preview work. For colorimetric-grade results (for example calibrating a display) use the CIE 1931 chromaticity equations with your monitor's profile. The slider here covers 1,000 K to 12,000 K, the range with practical meaning for lighting and design.",
      ],
    },
  ],
  howTo: [
    { name: "Set the temperature", text: "Drag the slider between 1000 K (warm) and 12000 K (cool)." },
    { name: "See the colour", text: "The swatch and HEX code update instantly." },
    { name: "Copy", text: "Click Copy to use the HEX in CSS, a design tool or a lighting preset." },
  ],
  faqs: [
    {
      question: "Why is 2700K called warm if it's a lower temperature?",
      answer:
        "The names describe how the light feels, not the physics. Lower Kelvin values produce orange light we associate with fire and sunsets (\"warm\"); higher values produce blue-white light we associate with cold daylight (\"cool\").",
    },
    {
      question: "What colour temperature should I use for a website's dark mode or night theme?",
      answer: "Warm tones around 2700–3500 K (soft oranges) reduce perceived glare in low light; blue-light filters such as Night Shift shift the screen toward roughly 3400 K.",
    },
    {
      question: "Which Kelvin value is 'true white'?",
      answer: "There is no single answer — 5000–5500 K matches midday sun, while 6500 K (D65) is the white point sRGB monitors are calibrated to, so #FFFFFF on your screen is by definition about 6500 K.",
    },
    {
      question: "Can I convert an RGB colour back to Kelvin?",
      answer: "Only approximately, and only for colours near the black-body curve. Camera and photo software does this for white balance; for an arbitrary colour the question has no meaningful answer.",
    },
  ],
  related: ["color-converter", "color-name-finder", "gradient-studio", "color-mixer", "color-harmony", "contrast-checker"],
};

export default content;
