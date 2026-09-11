import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Aspect Ratio Calculator – Resize Width & Height Proportionally",
  seoDescription:
    "Free aspect ratio calculator. Enter a ratio like 16:9 and one dimension to get the other, preview the shape, and use presets for 4:3, 1:1, 21:9 and 9:16. Perfect for video, screens and images.",
  intro:
    "Work out the missing width or height for any aspect ratio, check what ratio an existing image or screen has, and preview the shape before you export. Whether you are sizing a YouTube thumbnail, a 9:16 story, a 21:9 ultrawide wallpaper or a print at a custom proportion, type the numbers and the calculator does the arithmetic instantly.",
  sections: [
    {
      heading: "What an aspect ratio is",
      paragraphs: [
        "An aspect ratio describes the proportional relationship between width and height, written as width:height. 16:9 means that for every 16 units of width there are 9 units of height — the actual pixel size can be 1280×720, 1920×1080 or 3840×2160 and the shape stays identical. Keeping a ratio constant when you resize is what prevents images from looking squashed or stretched.",
        "To find the missing dimension you multiply the known one by the ratio: height = width × (9 ÷ 16) for 16:9. The calculator also runs this in reverse, so entering an image's width and height tells you its simplified ratio (a 1440×1080 photo is 4:3, for example).",
      ],
    },
    {
      heading: "Common aspect ratios and where they're used",
      bullets: [
        "16:9 — HD and 4K video, YouTube, monitors, TVs, presentations (1920×1080, 2560×1440, 3840×2160).",
        "9:16 — vertical video: Instagram Reels, TikTok, YouTube Shorts, Stories (1080×1920).",
        "4:3 — classic TV, iPads, older monitors, many DSLR and phone photo sensors (1024×768, 2048×1536).",
        "1:1 — square posts and profile pictures (1080×1080).",
        "21:9 — ultrawide monitors and cinematic video (2560×1080, 3440×1440).",
        "3:2 — 35 mm film and most DSLR / mirrorless photos, Surface devices (3000×2000).",
        "4:5 — Instagram portrait posts (1080×1350).",
        "2.39:1 — anamorphic widescreen cinema.",
      ],
    },
    {
      heading: "Tips for resizing without distortion",
      paragraphs: [
        "Decide on the target ratio first, then pick the largest dimensions your platform accepts. If the source photo has a different ratio, you will have to crop rather than stretch — the Image Cropper lets you lock a ratio while choosing which part to keep. When designing for several placements, work at the largest size and downscale; the Image Resize tool preserves the ratio automatically. For video, the Aspect Ratio Converter pads or crops footage to a new ratio without distorting it.",
      ],
    },
  ],
  howTo: [
    { name: "Enter the ratio", text: "Type the ratio (e.g. 16 and 9) or click a preset such as 16:9, 4:3, 1:1, 21:9 or 9:16." },
    { name: "Enter one dimension", text: "Type the width you have. The matching height is calculated instantly — or type the height to get the width." },
    { name: "Check the preview", text: "The live preview shows the proportion so you can sanity-check the shape." },
    { name: "Use the result", text: "Copy the dimensions into your design tool, video export settings or CSS." },
  ],
  faqs: [
    {
      question: "What height is 16:9 for a 1280 pixel width?",
      answer: "720 pixels. Multiply the width by 9 and divide by 16: 1280 × 9 ÷ 16 = 720.",
    },
    {
      question: "How do I find the aspect ratio of an image?",
      answer:
        "Enter its width and height and the calculator simplifies them to the smallest whole-number ratio — for example 1920×1080 becomes 16:9 and 3000×2000 becomes 3:2.",
    },
    {
      question: "What aspect ratio should I use for Instagram, TikTok and YouTube?",
      answer:
        "Instagram feed: 1:1 or 4:5; Reels, TikTok and YouTube Shorts: 9:16; YouTube videos and thumbnails: 16:9 (1280×720 minimum for thumbnails).",
    },
    {
      question: "Why do my dimensions come out as decimals?",
      answer:
        "Not every width divides evenly by every ratio. Round to the nearest whole pixel — a difference of less than one pixel is invisible — or adjust the width slightly so both numbers are integers (for 16:9, choose widths divisible by 16).",
    },
    {
      question: "Can I use this for CSS aspect-ratio?",
      answer:
        "Yes. Modern CSS supports aspect-ratio: 16 / 9 directly on an element; use the calculator to confirm the pixel dimensions you should expect at a given container width.",
    },
  ],
  related: ["image-cropper", "image-resize", "aspect-ratio-converter", "video-cropper", "svg-placeholder", "percentage-calculator"],
};

export default content;
