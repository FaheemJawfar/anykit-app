import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Mute Video Online Free – Remove Audio from MP4 Without Re-encoding",
  seoDescription:
    "Remove the sound from any video in seconds. Strips the audio track without re-encoding the picture, so quality is untouched. Free, private, no upload, no watermark. MP4, MOV, WebM and more.",
  intro:
    "Delete the audio track from a video — to remove background noise or a copyrighted song before posting, to prepare a clip for a silent autoplay banner, or to replace the sound later in an editor. The video stream is copied through untouched, so the process takes seconds and the picture quality is exactly the same. Everything happens on your device.",
  sections: [
    {
      heading: "Why mute a video?",
      bullets: [
        "Social platforms flag copyrighted music; muting lets you post the footage and add licensed audio in-app.",
        "Wind noise, chatter or an embarrassing comment in the background.",
        "Website hero videos and product loops are played silently by design — and browsers only autoplay videos that are muted or have no audio track at all.",
        "Screen recordings where the mic picked up keyboard noise or a notification.",
        "Preparing footage for a voice-over or a new soundtrack in a video editor.",
        "Smaller file: the audio track can account for 5–15% of a video's size.",
      ],
    },
    {
      heading: "How it works",
      paragraphs: [
        "The tool runs FFmpeg in your browser with the -an flag, which drops every audio stream, while copying the video stream (-c:v copy) without decoding it. Because nothing is re-encoded, the output is generated as fast as your device can read the file and there is zero quality loss. If the container does not allow a straight copy, the video is re-encoded once at a high-quality setting so it still plays everywhere.",
      ],
    },
    {
      heading: "Muted video for the web",
      paragraphs: [
        "Modern browsers block autoplay with sound. A video with no audio track — not just the muted attribute — is the most reliable way to get a background loop to play on iOS Safari and Chrome without user interaction. Combine this tool with the Video Compressor to keep the file small, and use <video autoplay muted loop playsinline> in your markup.",
      ],
    },
  ],
  howTo: [
    { name: "Add the video", text: "Drop an MP4, MOV, WebM, MKV or AVI onto the page. It stays on your device." },
    { name: "Mute", text: "Click Remove Audio. The audio track is stripped in seconds." },
    { name: "Download", text: "Preview the silent video and save it." },
  ],
  faqs: [
    {
      question: "Does muting reduce video quality?",
      answer: "No. The video stream is copied bit-for-bit; only the audio is removed.",
    },
    {
      question: "Can I keep the audio as a separate file?",
      answer: "Yes — run the original through Extract Audio first to save the soundtrack, then mute the video here.",
    },
    {
      question: "Can I lower the volume instead of removing it?",
      answer: "Extract the audio, adjust it with the Volume Adjuster, and recombine in a video editor. This tool removes the track entirely.",
    },
    {
      question: "Is my video uploaded?",
      answer: "No. Processing runs in your browser using FFmpeg compiled to WebAssembly.",
    },
  ],
  related: ["extract-audio", "video-compressor", "video-trimmer", "video-converter", "video-merger", "camera-recorder"],
};

export default content;
