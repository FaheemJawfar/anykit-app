import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Fade In / Fade Out Audio Online Free – Add Smooth Fades to MP3 & WAV",
  seoDescription:
    "Add a fade in, fade out or both to any audio file online for free. Set the fade length in seconds for smooth starts and endings on MP3, WAV, FLAC, AAC and OGG. Private, no upload.",
  intro:
    "Give a clip a gentle start and a clean ending instead of an abrupt cut. Set how many seconds the fade in and fade out should last, process, and download. Perfect for trimmed songs, ringtones, podcast intros and outros, voice-over beds and sound effects. The audio is processed on your own device and never uploaded.",
  sections: [
    {
      heading: "Why fades matter",
      paragraphs: [
        "When audio starts or stops mid-waveform the speaker cone jumps instantly from silence to signal, which the ear hears as a click or thump. A fade ramps the volume smoothly from zero (or to zero), removing the click and making an edit feel intentional. Fades are also how music is brought in under speech, how a looping clip is made to end naturally, and how background music is prevented from competing with a spoken intro.",
      ],
    },
    {
      heading: "Choosing fade lengths",
      bullets: [
        "10–50 ms — just enough to remove clicks at the edges of a tight edit; inaudible as a fade.",
        "0.5–1 s — natural for sound effects, ringtones and short clips.",
        "2–4 s — the standard for music intros and outros in podcasts and videos.",
        "5–10 s — long, cinematic fade-outs at the end of a song or a slow ambient bed.",
        "Different lengths for in and out are normal: a quick 0.5 s fade in with a leisurely 4 s fade out is a common combination.",
      ],
    },
    {
      heading: "How the fade is applied",
      paragraphs: [
        "The fade in is applied at the very start of the file for the duration you set. The fade out is anchored to the very end — the tool reverses the audio, applies a fade in, and reverses it back, which guarantees the fade finishes exactly at the last sample regardless of the file's length. Both ramps use FFmpeg's afade filter, and the output keeps the original format so an MP3 stays an MP3 and a WAV stays a WAV.",
      ],
    },
  ],
  howTo: [
    { name: "Add your audio", text: "Drop an MP3, WAV, FLAC, AAC or OGG file onto the page. It stays on your device." },
    { name: "Set the fades", text: "Enter the fade in and fade out durations in seconds. Set either to 0 to skip it." },
    { name: "Apply", text: "Click Apply Fades and wait for processing to finish." },
    { name: "Download", text: "Preview the result and save the faded file." },
  ],
  faqs: [
    {
      question: "Can I add only a fade out without a fade in?",
      answer: "Yes. Set the fade in to 0 and choose a fade-out length; the start of the file is left untouched.",
    },
    {
      question: "Will the fade change my audio quality?",
      answer:
        "The volume ramp itself is transparent. The file is re-encoded once in its original format, so use WAV or FLAC sources if you want a lossless result.",
    },
    {
      question: "How do I fade a specific section in the middle of a song?",
      answer:
        "Cut the section out with the Audio Trimmer, apply fades here, and rejoin the parts with the Audio Merger. Fades in this tool always apply to the start and end of the file.",
    },
    {
      question: "Can I fade the audio in a video?",
      answer: "Extract the soundtrack with Extract Audio, add the fades here, then recombine it with the video in your editor.",
    },
  ],
  related: ["audio-trimmer", "audio-merger", "volume-adjuster", "ringtone-maker", "audio-reverser", "silence-remover"],
};

export default content;
