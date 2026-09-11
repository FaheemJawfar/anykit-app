import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Online Camera & Screen Recorder – Record Webcam or Screen Free, No Install",
  seoDescription:
    "Record your webcam or your screen with audio directly in the browser and download a WebM video. No software, no account, no upload — the recording stays on your device.",
  intro:
    "Record a quick video message, a bug report, a tutorial or a practice presentation without installing anything. Choose your camera or your screen (a tab, a window or the whole display), allow microphone access if you want narration, hit record, and download the result when you stop. The recording is captured and saved entirely on your device — it is never uploaded.",
  sections: [
    {
      heading: "What you can record",
      bullets: [
        "Webcam — video messages, self-tape auditions, video CV clips, checking how you look and sound before a call.",
        "Screen — bug reproductions for support tickets, software walkthroughs, code reviews, presentation run-throughs. Choose a single tab, an application window or the full screen.",
        "Audio — your microphone is captured alongside either source; when sharing a browser tab you can also include the tab's own audio in most browsers.",
      ],
    },
    {
      heading: "How browser recording works",
      paragraphs: [
        "The recorder uses two standard web APIs. getUserMedia and getDisplayMedia ask your permission and then provide a live stream from the camera or screen; MediaRecorder encodes that stream in real time to WebM (VP8/VP9 video with Opus audio) and hands back a file when you stop. Because encoding happens on your machine, there is no length limit other than disk space, and the file is ready the instant you finish. Your browser shows a persistent indicator while the camera or screen is being captured, and you can revoke access at any time.",
      ],
    },
    {
      heading: "Tips for better recordings",
      bullets: [
        "Close notifications and unrelated tabs before recording your screen; pick a single window if you want to hide the rest.",
        "Face a window or lamp so the light is on you, not behind you, and put the camera at eye level.",
        "Use headphones or a headset to avoid echo when recording narration.",
        "Do a five-second test to check levels and framing before the real take.",
        "Need MP4 for a platform that rejects WebM? Run the download through the Video Converter. To cut mistakes, use the Video Trimmer; to remove audio, Mute Video.",
      ],
    },
  ],
  howTo: [
    { name: "Choose a source", text: "Select Camera or Screen. Your browser will ask permission the first time." },
    { name: "Record", text: "Click Record. A timer shows the elapsed length." },
    { name: "Stop and preview", text: "Click Stop to end the recording and play it back in the built-in player." },
    { name: "Download", text: "Save the WebM file to your device." },
  ],
  faqs: [
    {
      question: "Is my recording uploaded or stored online?",
      answer: "No. Capture, encoding and saving all happen on your device. Nothing is sent to AnyKit or anyone else.",
    },
    {
      question: "Why is the output WebM and not MP4?",
      answer:
        "Browsers' built-in MediaRecorder produces WebM (Safari produces MP4). WebM plays in every modern browser and on most platforms; convert to MP4 with the Video Converter if a service requires it.",
    },
    {
      question: "Can I record my screen on a phone?",
      answer: "Screen capture via the browser is desktop-only in most browsers. Camera recording works on phones; for screen recording on mobile use the operating system's built-in recorder.",
    },
    {
      question: "The camera or screen permission was denied — how do I fix it?",
      answer: "Click the camera or padlock icon in the address bar, allow Camera/Microphone or Screen access for this site, and reload the page. On macOS also check System Settings → Privacy & Security → Screen Recording for your browser.",
    },
  ],
  related: ["video-converter", "video-trimmer", "mute-video", "video-compressor", "extract-audio", "video-screenshot"],
};

export default content;
