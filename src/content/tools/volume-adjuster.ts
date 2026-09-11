import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Volume Adjuster – Increase or Decrease Audio Volume Online Free",
  seoDescription:
    "Make audio louder or quieter online for free. Boost quiet MP3s, voice memos and recordings or turn down loud files by a precise dB amount. Private, no upload, instant download.",
  intro:
    "Boost a recording that came out too quiet or tame one that is too loud. Set the change in decibels or as a percentage, preview the result, and download. It works on MP3, WAV, FLAC, AAC and OGG files, processes entirely on your device, and never uploads your audio anywhere.",
  sections: [
    {
      heading: "Decibels vs percentage",
      paragraphs: [
        "Loudness is perceived logarithmically, which is why audio engineers work in decibels rather than linear percentages. A change of +6 dB roughly doubles the amplitude and sounds \"noticeably louder\"; +10 dB is perceived as about twice as loud; -6 dB halves the amplitude. The percentage view here is simply the same change expressed linearly (200% = +6 dB), so use whichever you find easier to reason about.",
      ],
    },
    {
      heading: "How much can you boost before it clips?",
      paragraphs: [
        "Digital audio has a hard ceiling at 0 dBFS. If your file's loudest peak is at -3 dBFS, boosting by more than 3 dB pushes those peaks over the ceiling and they are clipped — heard as harsh crackling on loud parts. A quiet voice memo peaking at -20 dBFS can safely be boosted by 15–18 dB; a commercially mastered song already peaking near 0 dBFS cannot be boosted at all without distortion. If you need a quiet-but-peaky file to sound louder, use the Audio Compressor to reduce the peaks first, or the Loudness Normalizer to target a specific perceived level with automatic limiting.",
      ],
      bullets: [
        "Quiet phone or laptop recordings: +10 to +18 dB is typical.",
        "Slightly low podcast or voice-over: +3 to +6 dB.",
        "Music that is too loud next to speech: -6 to -12 dB.",
        "Match two clips: adjust one until they sound the same, or normalize both to the same LUFS.",
      ],
    },
    {
      heading: "Volume vs loudness normalization",
      paragraphs: [
        "This tool applies a fixed gain change across the whole file — the digital equivalent of turning a knob. That is exactly right when you know how much louder or quieter you want a file. If instead you want a file to hit a platform standard (Spotify, YouTube, podcasts) or several files to match each other automatically, the Loudness Normalizer measures the audio and calculates the gain for you.",
      ],
    },
  ],
  howTo: [
    { name: "Add your file", text: "Drop in the audio. It is decoded locally and never uploaded." },
    { name: "Choose the change", text: "Enter a positive value to make it louder or a negative value to make it quieter, in dB or percent." },
    { name: "Apply", text: "Click Apply and wait a moment while the gain is applied." },
    { name: "Preview and save", text: "Listen for clipping on the loudest parts, then download the adjusted file." },
  ],
  faqs: [
    {
      question: "Why does my audio sound distorted after boosting it?",
      answer:
        "The boost pushed the loudest peaks above 0 dBFS and they were clipped. Reduce the boost, or use the Audio Compressor to bring the peaks down first so the whole file can be raised safely.",
    },
    {
      question: "How many dB is twice as loud?",
      answer:
        "Perceived loudness roughly doubles every +10 dB. A +6 dB change doubles the signal amplitude and is clearly noticeable, while +3 dB is the smallest change most listeners describe as \"louder\".",
    },
    {
      question: "Can I make a very quiet recording usable?",
      answer:
        "Usually yes — boost by 10–20 dB. Be aware that background noise rises by the same amount; follow with the Silence Remover or the Audio Equalizer (cut 100 Hz) to clean it up.",
    },
    {
      question: "Does changing the volume reduce quality?",
      answer:
        "Gain changes are transparent as long as nothing clips. The file is re-encoded once on export; pick WAV or FLAC to keep it lossless.",
    },
  ],
  related: ["loudness-normalizer", "audio-compressor", "audio-equalizer", "fade-in-out", "silence-remover", "audio-converter"],
};

export default content;
