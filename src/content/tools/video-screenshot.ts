import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Video Screenshot – Extract a Frame from Video as PNG or JPG",
  seoDescription:
    "Take a screenshot of any video frame online. Scrub to the exact moment, capture at full resolution and download as PNG or JPG. Free, private, no upload — works with MP4, MOV, WebM.",
  intro:
    "Grab a still image from any moment in a video at the video's full native resolution — not a blurry screen capture of the player. Scrub to the exact frame, capture, and download as a lossless PNG or a smaller JPG. Ideal for thumbnails, documentation, bug reports, social posts and reference stills. The video stays on your device throughout.",
  sections: [
    {
      heading: "Why not just press Print Screen?",
      paragraphs: [
        "A screen capture gives you the frame at whatever size the player happens to be on your monitor, often with the player controls, letterboxing or a progress bar overlaid, and with the display's colour profile applied. This tool decodes the frame directly from the video file and draws it to a canvas at the stream's true width and height — so a 1080p video gives you a clean 1920×1080 image and a 4K video gives you 3840×2160, regardless of your screen.",
      ],
    },
    {
      heading: "PNG or JPG?",
      bullets: [
        "PNG — lossless; perfect for UI screenshots, text-heavy frames, and anything you plan to edit further. Larger file size.",
        "JPG — much smaller; ideal for thumbnails, photos and web use. Choose a quality level to balance size and sharpness.",
      ],
    },
    {
      heading: "Finding the right frame",
      paragraphs: [
        "Use the player's timeline to scrub to the moment you want, then pause. Videos are typically 24–60 frames per second, so a single frame lasts between 16 and 42 milliseconds — the current timestamp is shown so you can note it or reproduce the capture later. Pausing on a frame with motion blur is common in fast footage; nudge the position slightly forward or back to find a sharper one.",
      ],
    },
  ],
  howTo: [
    { name: "Open a video", text: "Drop a video file or click to select one. It loads in the player instantly without uploading." },
    { name: "Find the moment", text: "Scrub the timeline and pause on the exact moment you want to capture." },
    { name: "Capture", text: "Click Capture. The frame is rendered at full resolution and shown as a preview." },
    { name: "Download", text: "Choose PNG or JPG (and quality for JPG), then save the image." },
  ],
  faqs: [
    {
      question: "What resolution will the screenshot be?",
      answer:
        "The same as the video's own resolution — for example 1920×1080 for a Full HD file — independent of the size of the player on your screen.",
    },
    {
      question: "Can I take multiple screenshots from one video?",
      answer: "Yes. Move to a new position and capture again as many times as you like; each capture can be downloaded separately.",
    },
    {
      question: "Which video formats are supported?",
      answer:
        "Any format your browser can play, including MP4 (H.264/HEVC), WebM, MOV and OGG. If a file will not play, convert it to MP4 with the Video Converter first.",
    },
    {
      question: "Is the video uploaded anywhere?",
      answer: "No. The file is opened locally in your browser and frames are extracted on your device. Nothing is sent to a server.",
    },
  ],
  related: ["video-to-gif", "video-trimmer", "image-converter", "image-cropper", "image-resize", "video-converter"],
};

export default content;
