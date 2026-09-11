import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Video Trimmer – Cut & Trim Video Online Free, No Re-encoding",
  seoDescription:
    "Trim or cut a video online for free. Set start and end points, and export instantly without re-encoding — original quality, no upload, no watermark. Works with MP4, MOV, WebM and more.",
  intro:
    "Cut the boring start off a screen recording, clip a highlight from a long video, or shorten a clip to fit a social media limit. Set the in and out points on the timeline, preview the section, and export. Because the trimmer copies the video and audio streams instead of re-encoding them, exporting takes seconds even for large files and the quality is exactly the same as the original.",
  sections: [
    {
      heading: "Lossless trimming explained",
      paragraphs: [
        "Most online video cutters decode the whole file and re-encode the selected part, which is slow and degrades quality. This tool uses stream copy: it locates the selected time range and writes the existing compressed video and audio packets into a new MP4 container unchanged. The result is a bit-for-bit copy of that section — no generation loss, no colour shift, and the export time is limited only by how fast your device can read the file.",
        "The one trade-off with stream copy is that cuts snap to the nearest keyframe (typically every 1–5 seconds in phone and screen recordings). If your start point falls between keyframes the clip may begin a fraction of a second early. For frame-accurate cuts you can re-encode afterwards with the Video Converter, but for most trimming jobs keyframe accuracy is more than sufficient.",
      ],
    },
    {
      heading: "Common uses",
      bullets: [
        "Cutting a long Zoom, Teams or OBS recording down to the useful segment.",
        "Making clips for Instagram Reels, TikTok, YouTube Shorts and X, which have strict maximum durations.",
        "Removing dead time at the start and end of a phone video.",
        "Extracting a demo or bug reproduction from a longer screen capture before sharing it.",
        "Preparing a section to speed up, convert to GIF or mute with the other AnyKit video tools.",
      ],
    },
    {
      heading: "Supported files",
      paragraphs: [
        "Any container your browser can play — MP4, MOV, WebM, MKV, AVI, M4V and 3GP — can be trimmed. The output is an MP4 containing the original codecs, so an H.264 input stays H.264 and an HEVC input stays HEVC. Very large files work fine because nothing is uploaded; the limiting factor is your device's available memory.",
      ],
    },
  ],
  howTo: [
    { name: "Load your video", text: "Drop the file onto the page or browse for it. The video appears in the player with a timeline underneath." },
    { name: "Set start and end", text: "Drag the range handles or type exact times. Use the player to scrub to the exact moment you want to keep." },
    { name: "Trim", text: "Click Trim. The selected range is copied into a new file in a few seconds." },
    { name: "Download", text: "Preview the clip, then save the MP4 to your device." },
  ],
  faqs: [
    {
      question: "Does trimming reduce video quality?",
      answer:
        "No. The selected section is copied without re-encoding, so the picture and sound are identical to the original file.",
    },
    {
      question: "Why does my clip start slightly before the time I set?",
      answer:
        "Lossless trimming can only start on a keyframe. If your chosen start time is between two keyframes the clip begins at the previous one, usually well under a second earlier. This is the trade-off for instant, quality-preserving export.",
    },
    {
      question: "Can I cut out the middle of a video?",
      answer:
        "Trim the two parts you want to keep as separate clips, then join them with the Video Merger tool.",
    },
    {
      question: "Is there a maximum file size?",
      answer:
        "There is no upload limit because the file never leaves your device. Multi-gigabyte recordings work on most desktop computers; phones with limited memory may struggle with very large 4K files.",
    },
    {
      question: "Is my video uploaded to a server?",
      answer:
        "No. All processing runs in your browser using FFmpeg compiled to WebAssembly. Your footage remains private.",
    },
  ],
  related: ["video-merger", "video-speed-changer", "video-to-gif", "video-compressor", "extract-audio", "video-cropper"],
};

export default content;
