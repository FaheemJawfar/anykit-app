import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Video Speed Changer – Speed Up or Slow Down Video Online Free",
  seoDescription:
    "Change video speed online for free: speed up to 4x for time-lapses or slow down to 0.25x for slow motion, with pitch-corrected audio. Runs in your browser — no upload, no watermark.",
  intro:
    "Speed up a long screen recording, turn a clip into a time-lapse, or slow footage down for a smooth slow-motion effect. This tool re-times both the video frames and the audio track, keeping the audio pitch natural so voices don't turn into chipmunks or drones. Processing happens on your own device with a WebAssembly build of FFmpeg — your video is never uploaded, so there are no size limits imposed by a server, no queue and no watermark.",
  sections: [
    {
      heading: "How changing video speed works",
      paragraphs: [
        "A video's speed is defined by the timestamp attached to each frame. To speed up a clip by 2x, every frame's presentation timestamp is halved, so the same frames play in half the time; to slow down by 0.5x the timestamps are doubled. The audio is handled separately with a tempo filter that stretches or compresses the waveform while preserving pitch — the same technique podcast apps use for 1.5x playback.",
        "Because frames are re-timed rather than dropped or duplicated, speeding up is lossless in terms of picture content, and the output is re-encoded once at a quality setting chosen to stay visually close to the source. Slowing down below the original frame rate will show the source frames for longer, which looks fine for moderate slow-motion (0.5x) but can appear stuttery at extreme values if the original was shot at 24–30 fps.",
      ],
    },
    {
      heading: "Choosing the right speed",
      bullets: [
        "1.25x – 1.5x: tutorials, lectures and screen recordings — faster without losing intelligibility.",
        "2x – 4x: time-lapse style sequences, walk-throughs, unboxings and long process videos.",
        "0.75x: subtle slow motion that keeps speech understandable.",
        "0.5x – 0.25x: dramatic slow motion for sports, action shots or product reveals — best with source footage at 60 fps or higher.",
      ],
    },
    {
      heading: "Supported formats and limits",
      paragraphs: [
        "Upload MP4, MOV, WebM, MKV, AVI and most other common containers; the output is an MP4 (H.264 + AAC) that plays everywhere including social platforms and messaging apps. Because the work is done by your computer's CPU, very large files (multi-gigabyte 4K footage) will take longer than on a server farm — a rough guide is that a 1080p clip processes at around real-time on a modern laptop. Trimming the video first with the Video Trimmer keeps processing quick.",
      ],
    },
  ],
  howTo: [
    { name: "Select a video", text: "Drop a video file onto the page or click to browse. Nothing is uploaded — the file stays in your browser's memory." },
    { name: "Set the speed", text: "Pick a preset (0.25x, 0.5x, 1.5x, 2x, 4x) or type a custom multiplier. Values above 1 speed the video up; values below 1 slow it down." },
    { name: "Process", text: "Click the speed-change button and wait for the progress bar. Longer or higher-resolution videos take proportionally longer." },
    { name: "Preview and download", text: "Play the result in the built-in player to check timing and audio, then download the MP4." },
  ],
  faqs: [
    {
      question: "Does speeding up the video change the audio pitch?",
      answer:
        "No. The audio is processed with a tempo filter that changes speed while preserving pitch, so voices sound natural rather than higher or lower. If you want the classic pitch-shifted effect instead, use the Speed & Pitch audio tool.",
    },
    {
      question: "Is there a file size or length limit?",
      answer:
        "There is no server-imposed limit because nothing is uploaded. Practical limits come from your device's memory: files up to a few gigabytes work on most modern computers, and the process is faster on desktop than on phones.",
    },
    {
      question: "Will there be a watermark?",
      answer: "No. The output is a clean MP4 with no watermark, no branding and no account required.",
    },
    {
      question: "Can I change the speed of just part of a video?",
      answer:
        "Split the section out first with the Video Trimmer, change its speed here, then join the pieces back together with the Video Merger.",
    },
    {
      question: "What speed range is supported?",
      answer:
        "Anything from 0.25x (four times slower) to 4x (four times faster). Extreme values are achieved by chaining tempo filters so audio quality is maintained across the whole range.",
    },
    {
      question: "Is my video private?",
      answer:
        "Yes. The video is decoded, re-timed and re-encoded entirely on your device using FFmpeg compiled to WebAssembly. It is never transmitted to AnyKit or any third party.",
    },
  ],
  related: ["video-trimmer", "video-merger", "video-to-gif", "video-compressor", "speed-changer", "video-converter"],
};

export default content;
