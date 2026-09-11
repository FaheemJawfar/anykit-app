import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Audio Converter Online – Free MP3, WAV, FLAC, AAC & OGG Converter",
  seoDescription:
    "Convert audio files online for free: MP3, WAV, FLAC, AAC and OGG in any direction, with selectable bitrate. Runs in your browser — no upload, no file size limit, no sign-up.",
  intro:
    "Convert between the audio formats you actually run into — MP3, WAV, FLAC, AAC and OGG — without uploading anything. Choose the output format and bitrate, convert, and download. Because the conversion runs on your own device with FFmpeg, large albums and long recordings work as well as short clips, and your files stay private.",
  sections: [
    {
      heading: "Which format should I convert to?",
      bullets: [
        "MP3 — plays on literally everything. Best for sharing, podcasts and phones. Use 192 kbps for speech and 320 kbps for music.",
        "AAC (M4A) — better quality than MP3 at the same bitrate; native to Apple devices, YouTube and most streaming services. Good default for video soundtracks.",
        "OGG (Vorbis) — open, royalty-free and efficient; widely used in games and on Linux, and supported by all modern browsers.",
        "FLAC — lossless compression, roughly half the size of WAV with identical audio. Ideal for archiving and for masters you may re-encode later.",
        "WAV — uncompressed PCM. Required by some editing, sampling and broadcast workflows. Largest files, no quality loss.",
      ],
    },
    {
      heading: "Lossy vs lossless: what you lose and when it matters",
      paragraphs: [
        "MP3, AAC and OGG are lossy: they permanently discard parts of the signal judged inaudible, and every re-encode discards a little more. FLAC and WAV are lossless and can be converted back and forth indefinitely. Converting a lossy file to FLAC or WAV does not restore the lost detail — it only stops further loss — and converting between two lossy formats always costs a small amount of quality, so where possible convert from the highest-quality source you have.",
        "For music at 256–320 kbps AAC or MP3, almost no listener can tell the difference from lossless in blind tests. For speech, 96–128 kbps is transparent. Choose lossless when the file will be edited, sampled or archived; choose lossy when it will simply be listened to.",
      ],
    },
    {
      heading: "Bitrate guide",
      bullets: [
        "128 kbps — small files, fine for voice, acceptable for casual music listening.",
        "192 kbps — the sweet spot for podcasts, audiobooks and most music sharing.",
        "320 kbps — maximum MP3 quality; use for music you care about when lossless is impractical.",
      ],
    },
  ],
  howTo: [
    { name: "Add files", text: "Drop one or more audio files onto the page. Nothing is uploaded." },
    { name: "Pick the output", text: "Choose MP3, WAV, FLAC, AAC or OGG, and a bitrate for lossy formats." },
    { name: "Convert", text: "Click Convert and watch the progress bar." },
    { name: "Download", text: "Save the converted file — or all of them — to your device." },
  ],
  faqs: [
    {
      question: "Is there a file size limit?",
      answer:
        "No server limit, because the conversion happens on your device. Files of several hundred megabytes convert without issue on a modern computer; only your available memory sets the ceiling.",
    },
    {
      question: "Will converting WAV to MP3 lose quality?",
      answer:
        "MP3 is lossy, so yes — a small amount that is inaudible to most people at 256–320 kbps. Keep the WAV or make a FLAC copy if you want a perfect archive.",
    },
    {
      question: "Can I convert M4A to MP3?",
      answer:
        "Yes. M4A files contain AAC audio and can be loaded directly; choose MP3 as the output.",
    },
    {
      question: "Does the converter keep my tags and album art?",
      answer:
        "Basic metadata such as title, artist and album is carried over where the target format supports it. Use the Audio Metadata Editor afterwards if you need to fix or add tags.",
    },
    {
      question: "Are my files private?",
      answer:
        "Yes. Conversion runs in your browser via FFmpeg compiled to WebAssembly; no audio is sent to AnyKit or anyone else.",
    },
  ],
  related: ["audio-resampler", "audio-compressor", "audio-metadata-editor", "extract-audio", "video-converter", "audio-trimmer"],
};

export default content;
