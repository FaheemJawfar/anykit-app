import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Vocal Remover & Isolator Online – Make Karaoke Tracks Free",
  seoDescription:
    "Remove vocals from a song to make a karaoke backing track, or isolate the centre channel to bring vocals forward. Fast phase-cancellation processing in your browser — free, private, no upload.",
  intro:
    "Strip the lead vocal out of a stereo song to create an instrumental for karaoke or practice, or do the opposite and pull the centre-panned content forward. The tool uses classic centre-channel cancellation — the same technique built into karaoke machines — and processes the file on your device in seconds, with no upload and no account.",
  sections: [
    {
      heading: "How centre-channel cancellation works",
      paragraphs: [
        "In most mixes the lead vocal is panned dead centre, meaning it is identical in the left and right channels, while instruments are spread across the stereo field. Subtracting one channel from the other (L − R) cancels anything that is identical in both — the vocal — and leaves the parts that differ. Karaoke mode does exactly this. Vocal Only mode sums the channels (L + R) to mono, which reinforces the centre content relative to the sides, making the vocal more prominent.",
        "Because it relies on panning rather than machine learning, the effect depends on the mix: it works best on conventionally produced pop, rock and country tracks and less well on mono recordings, live recordings, or songs with heavily doubled, reverberant or stereo-widened vocals. Bass and kick drum, also typically centre-panned, are partly removed along with the vocal.",
      ],
    },
    {
      heading: "Modes",
      bullets: [
        "Karaoke — removes centre-panned vocals, leaving a backing track for singing along, practising an instrument part, or sampling.",
        "Vocal Only — collapses to mono to emphasise the centre; useful for hearing lyrics clearly, transcribing, or checking a vocal take.",
      ],
    },
    {
      heading: "Getting the best result",
      bullets: [
        "Use the highest-quality stereo source you have — lossless or high-bitrate MP3 — since artefacts are amplified by cancellation.",
        "If the vocal is only partly removed, the mix used stereo widening or doubled vocals; AI stem separation (Demucs, Spleeter, or commercial services) will do better on those.",
        "Follow with the Audio Equalizer to rebalance the bass that cancellation thins out, and the Loudness Normalizer to restore level.",
        "Trim the result to the section you need with the Audio Trimmer.",
      ],
    },
  ],
  howTo: [
    { name: "Add a song", text: "Drop a stereo MP3, WAV, FLAC, M4A or OGG file onto the page." },
    { name: "Choose a mode", text: "Select Karaoke to remove vocals or Vocal Only to emphasise them." },
    { name: "Process", text: "Click Process; the channel maths runs locally in a few seconds." },
    { name: "Listen and download", text: "Preview the result and save the file." },
  ],
  faqs: [
    {
      question: "Why can I still hear some vocals?",
      answer:
        "The vocal was not perfectly centred, had stereo reverb, or was doubled. Phase cancellation can only remove what is identical in both channels. For stubborn tracks use an AI stem separator.",
    },
    {
      question: "Why did the bass disappear too?",
      answer: "Bass and kick are usually centre-panned as well, so they are partly cancelled. Boost 60–120 Hz with the Audio Equalizer to compensate.",
    },
    {
      question: "Does it work on mono files?",
      answer: "No — a mono file has identical channels, so cancellation removes everything. The technique requires a genuine stereo mix.",
    },
    {
      question: "Is my music uploaded?",
      answer: "No. Processing runs in your browser with FFmpeg compiled to WebAssembly.",
    },
  ],
  related: ["channel-mixer", "audio-equalizer", "audio-trimmer", "loudness-normalizer", "speed-changer", "audio-effects-studio"],
};

export default content;
