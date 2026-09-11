import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Loudness Normalizer – Normalize Audio to -14, -16 or -23 LUFS Online",
  seoDescription:
    "Normalize audio loudness online for free. Hit -14 LUFS for Spotify and YouTube, -16 LUFS for Apple Podcasts or -23 LUFS EBU R128 for broadcast, with true-peak limiting. Private, no upload.",
  intro:
    "Make every track, episode or clip sit at the same perceived volume. This normalizer measures integrated loudness in LUFS — the standard streaming platforms and broadcasters actually use — and adjusts your file to hit a target with a true-peak ceiling so it will not clip or be turned down by the platform. Choose a preset for streaming, podcasts or broadcast, process, and download. Nothing is uploaded.",
  sections: [
    {
      heading: "Why peak normalization is not enough",
      paragraphs: [
        "Traditional normalization scales a file so its loudest sample hits 0 dBFS. But two files with the same peak can sound wildly different in volume — a compressed pop master and a dynamic acoustic recording, for example. Loudness normalization instead measures how loud the file is perceived over its whole duration (integrated loudness, in LUFS) using the ITU BS.1770 model of human hearing, and adjusts gain so that perceived level matches the target. This is exactly what Spotify, YouTube, Apple Music and TV broadcasters do to your audio on playback — normalizing to their target yourself means you control the result instead of the platform.",
      ],
    },
    {
      heading: "Which target should I use?",
      bullets: [
        "-14 LUFS, -1 dBTP (Streaming) — Spotify, YouTube, Amazon Music, Tidal. Louder masters are simply turned down, so there is no benefit to exceeding this.",
        "-16 LUFS, -1.5 dBTP (Podcast) — Apple Podcasts' recommendation, and comfortable for spoken word on phones and earbuds. Many podcast hosts suggest -16 stereo / -19 mono.",
        "-23 LUFS, -2 dBTP (Broadcast) — EBU R128 for European TV and radio; ATSC A/85 in the US uses -24 LUFS. Required for most broadcast deliverables.",
      ],
    },
    {
      heading: "LUFS, true peak and LRA explained",
      paragraphs: [
        "LUFS (Loudness Units relative to Full Scale) is the perceived loudness — one LU is equivalent to one dB of gain. True peak (dBTP) is the highest level the analogue waveform will reach after digital-to-analogue conversion, which can exceed the sample peak; keeping it at or below -1 dBTP prevents distortion in lossy encoders. Loudness Range (LRA) describes how much the loudness varies across the programme; the presets set a sensible LRA so quiet passages are preserved but extreme dynamics are gently contained.",
        "The normalizer uses FFmpeg's EBU R128 loudnorm filter, which analyses the whole file first, then applies the correction — the same two-stage approach used by professional mastering and broadcast QC tools.",
      ],
    },
  ],
  howTo: [
    { name: "Add your audio", text: "Drop in an MP3, WAV, FLAC, AAC or OGG file. Processing is local to your device." },
    { name: "Pick a target", text: "Choose Streaming (-14 LUFS), Podcast (-16 LUFS) or Broadcast (-23 LUFS)." },
    { name: "Normalize", text: "Click Normalize. The file is measured, then gain and true-peak limiting are applied." },
    { name: "Download", text: "Listen to the result and download the normalized file." },
  ],
  faqs: [
    {
      question: "What LUFS should a podcast be?",
      answer:
        "Apple recommends -16 LUFS integrated with a -1 dBTP ceiling for stereo podcasts, and many hosts recommend -19 LUFS for mono. -16 is a safe default that sounds consistent across phones, cars and earbuds.",
    },
    {
      question: "Why does my music sound quieter after normalizing to -14 LUFS?",
      answer:
        "Modern masters are often -8 to -10 LUFS. Streaming platforms turn them down to -14 anyway, so normalizing yourself changes nothing about the final playback level — it just lets you hear what listeners will hear and avoids the platform's limiter.",
    },
    {
      question: "Does loudness normalization compress the audio?",
      answer:
        "Primarily it applies a single gain change. Only when peaks would exceed the true-peak ceiling does it apply limiting, so dynamics are largely preserved. For heavier levelling use the Audio Compressor first.",
    },
    {
      question: "Can I normalize several files to match each other?",
      answer:
        "Yes — run each file through with the same target. Because the target is absolute (for example -16 LUFS), every file will end up at the same perceived loudness.",
    },
    {
      question: "Is this the same as YouTube or Spotify normalization?",
      answer:
        "It uses the same measurement standard (ITU BS.1770 / EBU R128) and the same targets those platforms publish, so the result is what they will play back without further adjustment.",
    },
  ],
  related: ["volume-adjuster", "audio-compressor", "audio-equalizer", "audio-resampler", "silence-remover", "audio-converter"],
};

export default content;
