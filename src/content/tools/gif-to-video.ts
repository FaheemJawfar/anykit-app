import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "GIF to MP4 Converter Online Free – Convert GIF to Video (MP4/WebM)",
  seoDescription:
    "Convert animated GIFs to MP4 or WebM video in your browser. Choose quality, cut file size by up to 90%, and upload to Instagram, TikTok, Twitter or Slack. Free, private, no watermark.",
  intro:
    "Turn an animated GIF into a real video file — MP4 for universal playback or WebM for the web — in seconds. Video files are typically 5–10 times smaller than the GIF they came from, play with hardware acceleration, and are accepted by platforms that reject or mangle GIFs. Conversion runs on your device with FFmpeg compiled to WebAssembly, so nothing is uploaded.",
  sections: [
    {
      heading: "Why convert a GIF to video?",
      bullets: [
        "File size — GIF stores every frame as an indexed image with no inter-frame compression; a 10 MB GIF often becomes a 500 KB MP4 with better colour.",
        "Colour — GIF is limited to 256 colours per frame; MP4 and WebM reproduce the full palette without dithering.",
        "Platforms — Instagram, TikTok and YouTube Shorts require video; Twitter/X and Slack convert GIFs to video anyway, so you may as well control the quality.",
        "Web performance — <video autoplay muted loop playsinline> is the modern replacement for GIFs on websites; it loads faster and uses less CPU and battery.",
        "Editing — video files can be trimmed, sped up, merged and captioned with standard tools.",
      ],
    },
    {
      heading: "MP4 or WebM?",
      paragraphs: [
        "MP4 (H.264) plays everywhere — every phone, browser, messaging app and social platform — and is the safe default. WebM (VP9) is an open format that compresses slightly better and supports transparency, but Apple devices only gained full support recently and some apps still reject it. For websites, serve WebM with an MP4 fallback in a <source> list; for sharing and social media, choose MP4.",
        "The quality presets trade size against sharpness: Low is fine for simple animations and reaction GIFs, Medium suits most screen recordings, and High preserves fine detail and text in UI demos. Because GIFs often have odd dimensions, the converter pads to even width and height as required by the codecs.",
      ],
    },
    {
      heading: "Tips",
      bullets: [
        "Convert the highest-quality GIF you have; generation loss from the GIF's 256-colour palette cannot be undone.",
        "For a loop on your site, use the muted, loop and playsinline attributes so it behaves like the GIF did on mobile.",
        "Need to go the other way? The Video to GIF tool converts clips back into GIFs with palette optimisation.",
        "To shorten a long GIF-turned-video, run the result through the Video Trimmer.",
      ],
    },
  ],
  howTo: [
    { name: "Add the GIF", text: "Drop an animated GIF onto the page or click to select it." },
    { name: "Choose format and quality", text: "Pick MP4 or WebM and a Low, Medium or High quality preset." },
    { name: "Convert", text: "Click Convert and wait for the progress bar; most GIFs finish in seconds." },
    { name: "Download", text: "Preview the video and save it." },
  ],
  faqs: [
    {
      question: "Will the video keep the GIF's transparency?",
      answer:
        "MP4 does not support transparency; transparent areas become black or the GIF's background colour. WebM (VP9) can carry an alpha channel in supporting players.",
    },
    {
      question: "Does the video loop like the GIF?",
      answer:
        "Video files do not contain a loop flag; looping is controlled by the player. On the web add the loop attribute; most social platforms loop short videos automatically.",
    },
    {
      question: "How much smaller will the MP4 be?",
      answer: "Typically 80–95% smaller than the GIF, depending on its complexity. Photographic or noisy GIFs shrink the most.",
    },
    {
      question: "Is my GIF uploaded anywhere?",
      answer: "No. Conversion happens in your browser using FFmpeg WebAssembly; the file never leaves your device.",
    },
  ],
  related: ["video-to-gif", "video-compressor", "video-converter", "video-trimmer", "image-converter", "video-speed-changer"],
};

export default content;
