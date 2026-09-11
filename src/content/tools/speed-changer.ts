import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Audio Speed & Pitch Changer – Speed Up or Slow Down Audio Online",
  seoDescription:
    "Change audio speed and pitch online for free. Speed up or slow down MP3s, songs and recordings from 0.5x to 2x with pitch preserved, or shift pitch independently. Private, no upload.",
  intro:
    "Slow a song down to learn a solo, speed up a lecture recording, nightcore a track, or shift a vocal into a different key — all without installing anything. Speed and pitch are controlled separately: change tempo while keeping the original pitch, change pitch while keeping tempo, or move both together for the classic tape-speed effect. The audio is processed on your own device and never uploaded.",
  sections: [
    {
      heading: "Speed and pitch are independent here",
      paragraphs: [
        "On a record player or tape machine, speed and pitch are locked together: play faster and everything goes up in pitch. Digital time-stretching breaks that link. The speed control uses a tempo algorithm that stretches or compresses time while preserving the harmonic content, so a voice slowed to 0.75x still sounds like the same person. The pitch control resamples the audio to a new rate and then corrects the tempo back, shifting the key without changing the duration.",
        "Combine them for creative effects — slow down and pitch down for a \"slowed + reverb\" style, or speed up and pitch up for nightcore — or use one at a time for practical tasks like transcribing fast speech or transposing a backing track.",
      ],
    },
    {
      heading: "Common uses",
      bullets: [
        "Musicians: slow difficult passages to 0.5x–0.75x while keeping pitch to learn them accurately.",
        "Students and transcribers: play lectures and interviews at 0.75x for clarity or 1.5x–2x to save time.",
        "Singers: transpose a karaoke or backing track a few semitones to fit your range.",
        "Producers: create slowed, nightcore or chipmunk variants of a track.",
        "Language learners: slow native speech without the dropped pitch that makes it sound unnatural.",
      ],
    },
    {
      heading: "Quality tips",
      paragraphs: [
        "Time-stretching works best within roughly 0.5x–2x; beyond that, transient smearing and phasey artefacts become audible on complex material like full mixes. For extreme slow-downs, apply the change in two passes. Pitch shifts of up to ±5 semitones are generally transparent; larger shifts on vocals start to sound synthetic, which may be exactly what you want. Export to WAV or FLAC if you plan to edit further, or MP3 for sharing.",
      ],
    },
  ],
  howTo: [
    { name: "Load your audio", text: "Drop in an MP3, WAV, FLAC, AAC or OGG file. It stays in your browser." },
    { name: "Set speed", text: "Move the speed slider between 0.5x and 2x. Pitch is preserved by default." },
    { name: "Set pitch", text: "Shift the pitch up or down in semitones if you want a key change or a creative effect." },
    { name: "Process and download", text: "Click Apply, preview the result, and download the file." },
  ],
  faqs: [
    {
      question: "Can I slow down a song without changing the pitch?",
      answer:
        "Yes. Leave the pitch control at 0 and adjust only the speed slider — the tempo changes while the key stays the same.",
    },
    {
      question: "Can I change the key of a song without changing the tempo?",
      answer:
        "Yes. Set the speed to 1x and move the pitch control by the number of semitones you need; the duration remains identical.",
    },
    {
      question: "How do I make a nightcore or slowed version?",
      answer:
        "For nightcore, set speed to around 1.25x and pitch to +2 or +3 semitones. For a slowed version, set speed to 0.8x–0.85x and pitch to -1 or -2 semitones, then add reverb in the Audio Effects Studio.",
    },
    {
      question: "Why does heavily slowed audio sound watery or metallic?",
      answer:
        "All time-stretching algorithms have to invent the material between the original samples. Below 0.5x the guesswork becomes audible, especially on drums and dense mixes. Stay inside 0.5x–2x for the cleanest results.",
    },
    {
      question: "Does this work for video?",
      answer:
        "For video files use the Video Speed Changer, which re-times both picture and pitch-corrected sound together.",
    },
  ],
  related: ["video-speed-changer", "audio-reverser", "audio-trimmer", "audio-effects-studio", "audio-converter", "fade-in-out"],
};

export default content;
