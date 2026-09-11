import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Reverse Audio Online Free – Play Any Sound or Song Backwards",
  seoDescription:
    "Reverse audio online for free. Upload an MP3, WAV or any sound file and play it backwards for reversed vocals, cymbal swells and creative effects. Private, no upload, no watermark.",
  intro:
    "Flip any audio file so it plays from end to start. Reversing is one of the oldest studio tricks — reversed cymbals, reverse reverb tails and backwards vocals appear on countless records — and it is also handy for checking hidden messages, making eerie sound design for games and video, or creating a puzzle for language and music students. Drop in a file, click reverse, preview, and download. Your audio never leaves your device.",
  sections: [
    {
      heading: "What reversing audio actually does",
      paragraphs: [
        "Digital audio is a long list of samples — tens of thousands per second. Reversing simply writes those samples out in the opposite order, so the last sample becomes the first. Nothing is resampled, pitch-shifted or filtered, which means the tonal content is unchanged; only the direction of time flips. A sharp attack followed by a slow decay (a drum hit, a piano note) becomes a slow swell that ends abruptly — the classic \"reverse cymbal\" sound.",
      ],
    },
    {
      heading: "Creative uses for reversed audio",
      bullets: [
        "Reverse cymbal and reverse snare swells to lead into a drop or chorus.",
        "Reverse reverb: reverse a vocal, add reverb, then reverse it back so the tail precedes the word.",
        "Backwards speech and whispers for horror and sci-fi sound design.",
        "Reversed guitar solos and pads in psychedelic and shoegaze production.",
        "Ear-training and phonetics exercises — students try to speak a phrase so it sounds right when reversed.",
        "Checking a song for \"backmasking\" or hidden reversed messages.",
      ],
    },
    {
      heading: "Formats and quality",
      paragraphs: [
        "Load MP3, WAV, FLAC, AAC/M4A, OGG or any audio your browser can decode. Reversal itself is lossless; the output is encoded once in the format you choose, so pick WAV or FLAC if you plan to keep editing, or MP3 for a small shareable file. Long files are processed on your own device with FFmpeg compiled to WebAssembly, so there is no upload wait and no size cap other than your device's memory.",
      ],
    },
  ],
  howTo: [
    { name: "Add your audio", text: "Drop an audio file onto the page or click to select one. Nothing is uploaded." },
    { name: "Reverse", text: "Click the Reverse button. Processing takes a few seconds for typical songs." },
    { name: "Preview", text: "Listen to the backwards version in the built-in player." },
    { name: "Download", text: "Save the reversed file to your device." },
  ],
  faqs: [
    {
      question: "Does reversing audio change the quality or pitch?",
      answer:
        "No. The samples are written in reverse order without any resampling or pitch processing, so the frequency content is identical to the original. Only the final encode to your chosen format affects quality, and WAV or FLAC keep it lossless.",
    },
    {
      question: "Can I reverse just part of a song?",
      answer:
        "Cut out the section first with the Audio Trimmer, reverse it here, then rejoin the pieces with the Audio Merger.",
    },
    {
      question: "Can I reverse a video's audio?",
      answer:
        "Use the Extract Audio tool to pull the soundtrack from your video, reverse it here, then combine it with the footage in a video editor.",
    },
    {
      question: "Is my recording kept private?",
      answer:
        "Yes. The whole process runs in your browser; the file is never sent to AnyKit or any third-party server.",
    },
  ],
  related: ["audio-trimmer", "speed-changer", "fade-in-out", "audio-effects-studio", "audio-merger", "extract-audio"],
};

export default content;
