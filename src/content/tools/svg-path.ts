import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "SVG Path Visualizer – Preview & Edit SVG Path d Attributes Online",
  seoDescription:
    "Paste any SVG path data and see it rendered instantly. Adjust stroke, fill, stroke width and viewBox to debug icons and shapes, then copy the finished SVG. Free, browser-based.",
  intro:
    "Paste the d attribute of an SVG <path> — M10 10 L90 90 C… — and see exactly what it draws, live, as you edit. Change the stroke and fill colours, stroke width and viewBox to debug icons, logos, chart shapes and hand-written paths, then copy the ready-to-use SVG markup. Everything renders in your browser with no upload.",
  sections: [
    {
      heading: "SVG path commands at a glance",
      bullets: [
        "M x y — move to a point without drawing (start a new sub-path).",
        "L x y — draw a straight line to a point.  H x / V y — horizontal or vertical line.",
        "C x1 y1 x2 y2 x y — cubic Bézier curve with two control points.  S — smooth cubic continuing the previous curve.",
        "Q x1 y1 x y — quadratic Bézier with one control point.  T — smooth quadratic.",
        "A rx ry rotation large-arc sweep x y — elliptical arc; the two flags choose which of the four possible arcs to draw.",
        "Z — close the path back to the start point.",
        "Lowercase letters (m, l, c…) use coordinates relative to the current point instead of absolute ones.",
      ],
    },
    {
      heading: "Why paths render wrong, and how to fix them",
      bullets: [
        "Nothing visible — the viewBox doesn't cover the coordinates. Set it to encompass the path's bounding box (e.g. 0 0 100 100 for coordinates under 100).",
        "Shape is filled solid when you wanted an outline — set fill to none and give it a stroke.",
        "Tiny or huge shape — the path was authored for a different coordinate space; adjust the viewBox rather than the path.",
        "Arcs look wrong — flip the large-arc or sweep flag (the two 0/1 values in an A command).",
        "Jagged joins — increase stroke width slightly or check that sub-paths are closed with Z.",
      ],
    },
    {
      heading: "Where SVG paths come from",
      paragraphs: [
        "Every icon library — Lucide, Heroicons, Font Awesome, Material Symbols — ships icons as path data, and design tools such as Figma, Illustrator and Inkscape export shapes the same way. Paths also power charts (D3 generates them), animated logos, clip-paths and CSS motion paths. Being able to read and tweak the d attribute directly saves round-trips to a design tool. Once the shape is right, run it through the SVG Optimizer to shrink the markup, or SVG to JSX to use it in React.",
      ],
    },
  ],
  howTo: [
    { name: "Paste path data", text: "Enter the contents of a path's d attribute." },
    { name: "Adjust the viewBox", text: "Set the viewBox so the whole shape is in view." },
    { name: "Style it", text: "Choose stroke colour, fill colour and stroke width to match your use." },
    { name: "Copy the SVG", text: "Copy the complete <svg> markup for your project." },
  ],
  faqs: [
    {
      question: "Why does my path not show anything?",
      answer:
        "Usually the viewBox does not include the path's coordinates, or the fill is set to none with no stroke. Check the coordinate range in your path and set the viewBox to cover it.",
    },
    {
      question: "What is the difference between uppercase and lowercase commands?",
      answer: "Uppercase commands take absolute coordinates; lowercase take coordinates relative to the current pen position. They can be mixed freely in one path.",
    },
    {
      question: "Can I visualise multiple paths at once?",
      answer: "Paste one path at a time, or combine them into a single d attribute — multiple M commands create separate sub-paths within one path element.",
    },
    {
      question: "How do I make the path scale to any size?",
      answer:
        "Keep a viewBox on the <svg> and set width and height in CSS or attributes; the path scales proportionally. Leave the path coordinates alone.",
    },
  ],
  related: ["svg-optimizer", "svg-jsx", "svg-placeholder", "lottie-preview", "image-converter", "css-grid"],
};

export default content;
