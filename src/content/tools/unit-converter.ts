import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Unit Converter Online – Length, Weight, Temperature & Data Sizes",
  seoDescription:
    "Free unit converter for length (m, km, miles, feet, inches), weight (kg, lb, oz), temperature (°C, °F, K) and digital data (bytes to TB). Instant, accurate, no sign-up.",
  intro:
    "Convert between metric and imperial units, temperature scales and digital storage sizes with results that update as you type. Pick a category, choose the from and to units, enter a value and read the answer — no ads between you and the result, and it works offline once loaded.",
  sections: [
    {
      heading: "Supported units",
      bullets: [
        "Length — metres, kilometres, centimetres, millimetres, miles, yards, feet, inches.",
        "Weight — kilograms, grams, milligrams, pounds, ounces.",
        "Temperature — Celsius, Fahrenheit, Kelvin.",
        "Digital data — bytes, kilobytes, megabytes, gigabytes, terabytes.",
      ],
    },
    {
      heading: "How the conversions work",
      paragraphs: [
        "Length, weight and data conversions are ratio-based: each unit has a fixed factor relative to a base unit (the metre, the kilogram, the byte), so a value is first converted to the base and then to the target. One inch is exactly 25.4 mm, one pound is exactly 0.45359237 kg, and one mile is 1,609.344 m by international agreement, so results are exact rather than approximate. Temperature is different because the scales have different zero points: °F = °C × 9/5 + 32, and K = °C + 273.15, which is why 0 °C is 32 °F rather than 0 °F.",
        "Digital data here uses the binary convention (1 KB = 1,024 bytes, 1 MB = 1,048,576 bytes), which is how Windows, most file managers and memory sizes are reported. Storage manufacturers and network speeds use decimal units (1 GB = 1,000,000,000 bytes) instead, which is why a \"500 GB\" drive shows as about 465 GB in Windows.",
      ],
    },
    {
      heading: "Handy reference conversions",
      bullets: [
        "1 mile = 1.609 km; 1 km = 0.621 miles; 1 foot = 30.48 cm; 1 inch = 2.54 cm.",
        "1 kg = 2.205 lb; 1 lb = 453.6 g; 1 oz = 28.35 g.",
        "Body temperature 37 °C = 98.6 °F; water boils at 100 °C = 212 °F = 373.15 K.",
        "1 GB = 1,024 MB = 1,048,576 KB; a 4.7 GB DVD holds about 4,482 MiB of data.",
      ],
    },
  ],
  howTo: [
    { name: "Pick a category", text: "Choose Length, Weight, Temperature or Digital Data." },
    { name: "Select units", text: "Choose the unit you have and the unit you want." },
    { name: "Enter a value", text: "Type the number; the converted result appears instantly." },
    { name: "Swap or copy", text: "Swap the direction to convert back, or copy the result." },
  ],
  faqs: [
    {
      question: "Is 1 GB 1,000 MB or 1,024 MB?",
      answer:
        "This converter uses the binary convention, 1 GB = 1,024 MB, matching Windows and most operating systems. Storage vendors and the SI standard use 1 GB = 1,000 MB; strictly, the 1,024-based unit is called a gibibyte (GiB), which is the source of the confusion.",
    },
    {
      question: "How do I convert Celsius to Fahrenheit in my head?",
      answer: "Double the Celsius value and add 30 for a quick estimate (20 °C ≈ 70 °F); the exact formula is °C × 1.8 + 32 = 68 °F.",
    },
    {
      question: "Are the imperial conversions exact?",
      answer: "Yes. The inch, foot, yard, mile, pound and ounce are defined exactly in metric terms by international agreement, so conversions are precise, not rounded approximations.",
    },
    {
      question: "Can I convert currencies or areas?",
      answer: "Not in this tool. It focuses on length, weight, temperature and data. For time-based units use the Time Duration Converter; for temperature-specific work see the Temperature Converter.",
    },
  ],
  related: ["temperature-converter", "time-duration-converter", "integer-base-converter", "percentage-calculator", "bmi-calculator", "calculator"],
};

export default content;
