import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Audio Equalizer Online – Free 8-Band EQ for MP3, WAV & More",
  seoDescription:
    "Equalize audio online for free with an 8-band EQ from 100 Hz sub-bass to 16 kHz air. Boost bass, tame harshness or clean up muddy vocals, then download. Private, no upload required.",
  intro:
    "Shape the tone of any audio file with a graphic equalizer that runs in your browser. Eight bands from 100 Hz to 16 kHz let you add weight to thin recordings, cut boominess, brighten dull vocals or carve out room for a voice-over under music. Adjust the sliders, process, listen, and download — the file never leaves your device.",
  sections: [
    {
      heading: "What each EQ band controls",
      bullets: [
        "100 Hz Sub — rumble and the deepest bass; cut to remove handling noise and traffic, boost carefully for weight in music.",
        "250 Hz Bass — body and warmth; too much here is the most common cause of a muddy mix.",
        "500 Hz Low-Mid — fullness of voices and guitars; a boxy or \"cardboard\" sound usually lives here.",
        "1 kHz Mid — the core of most instruments and the honk in nasal vocals.",
        "2 kHz High-Mid — attack and definition; boost for clarity in speech.",
        "4 kHz Presence — intelligibility and bite; also where harshness and listener fatigue begin.",
        "8 kHz Treble — crispness, sibilance (\"s\" and \"t\" sounds) and cymbal detail.",
        "16 kHz Air — openness and sheen; boosting adds sparkle, cutting hides hiss in old recordings.",
      ],
    },
    {
      heading: "Practical EQ recipes",
      bullets: [
        "Podcast or voice-over clean-up: cut 100 Hz by 6–10 dB, dip 250–500 Hz by 2–3 dB, boost 2–4 kHz by 2 dB.",
        "More bass without mud: lift 100 Hz by 3 dB and pull 250 Hz down 2 dB.",
        "Dull phone recording: boost 4 kHz and 8 kHz by 3–4 dB and add 2 dB at 16 kHz.",
        "Harsh, tinny audio: cut 4 kHz by 3 dB and 8 kHz by 2 dB.",
        "Music under narration: cut the music at 1–4 kHz by 4–6 dB so the voice sits on top.",
      ],
    },
    {
      heading: "Cut before you boost",
      paragraphs: [
        "Boosting several bands adds level and can push the output into clipping. Where possible, achieve the balance by cutting the problem frequencies and then raising the overall volume if needed — the result is cleaner and keeps headroom. Use small moves (2–4 dB) and compare with the original; EQ changes that seem subtle in isolation are usually the right amount. If the finished file ends up too quiet or too loud, follow up with the Loudness Normalizer or Volume Adjuster.",
      ],
    },
  ],
  howTo: [
    { name: "Load a file", text: "Drop in an MP3, WAV, FLAC, AAC or OGG file. It is processed locally." },
    { name: "Adjust the bands", text: "Drag each slider up to boost or down to cut that frequency range. Start with the presets if you are unsure." },
    { name: "Apply", text: "Click Apply EQ to process the whole file with your settings." },
    { name: "Compare and download", text: "Listen to the result, tweak if needed, and save the equalized file." },
  ],
  faqs: [
    {
      question: "Is this a real EQ or just a bass/treble control?",
      answer:
        "It is an 8-band parametric-style equalizer with peaking filters centred at 100, 250, 500, 1k, 2k, 4k, 8k and 16k Hz, applied with FFmpeg's equalizer filter — the same processing you would get from a desktop tool.",
    },
    {
      question: "Can I boost bass without distortion?",
      answer:
        "Keep boosts moderate (3–6 dB) and consider cutting 250 Hz slightly at the same time. If the source is already loud, lower the overall volume afterwards to avoid clipping.",
    },
    {
      question: "Will the EQ reduce audio quality?",
      answer:
        "The filtering itself is transparent. The file is re-encoded once on export, so choose WAV or FLAC output if you plan to keep editing, or MP3 for a small final file.",
    },
    {
      question: "Does it work on a video's audio?",
      answer:
        "Extract the audio track with the Extract Audio tool, equalize it here, then replace the audio in your video editor.",
    },
  ],
  related: ["loudness-normalizer", "volume-adjuster", "audio-compressor", "audio-effects-studio", "silence-remover", "voice-isolator"],
};

export default content;
