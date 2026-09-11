import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Audio Trimmer Online Free – Cut MP3, WAV & Any Audio Without Quality Loss",
  seoDescription:
    "Trim or cut audio online for free. Set start and end times, preview the selection and export instantly with no re-encoding — original quality, no upload, no watermark. MP3, WAV, FLAC, M4A, OGG.",
  intro:
    "Cut a song down to the chorus, clip a quote from an interview, remove dead air from the start of a recording, or make a sample from a longer track. Set the start and end points, preview exactly the section you're keeping, and export. Because the trimmer copies the audio stream rather than re-encoding it, the result is bit-identical to the original and finishes in seconds. Your file never leaves your device.",
  sections: [
    {
      heading: "Lossless trimming",
      paragraphs: [
        "Most online audio cutters decode your MP3 and re-encode the section you keep, which adds another round of compression loss and takes time. This tool uses stream copy: it seeks to your start point and writes the existing compressed frames straight into a new file. An MP3 stays an MP3 at the same bitrate; a FLAC stays lossless. The trade-off is that cuts land on frame boundaries — about 26 ms for MP3 — which is imperceptible for almost every use. If you need a fade at the cut points, run the result through the Fade In/Out tool.",
      ],
    },
    {
      heading: "What people trim",
      bullets: [
        "Ringtones and alarm sounds — 20–30 seconds of a favourite song (see also the Ringtone Maker, which adds fades and iPhone M4R export).",
        "Podcast clips for social media — pull the best 60 seconds for a teaser.",
        "Voice memos and lectures — remove the fumbling at the start and the silence at the end.",
        "Samples and loops — isolate a drum break or a vocal phrase for production.",
        "Sound effects — cut a single hit out of a longer recording.",
        "Music for videos — trim a track to the length of a clip before importing it into an editor.",
      ],
    },
    {
      heading: "Supported files",
      paragraphs: [
        "Any audio your browser can decode: MP3, WAV, FLAC, AAC/M4A, OGG, OPUS, AIFF and the audio track of many video containers. Output keeps the input format. There is no size limit beyond your device's memory, so hour-long recordings work fine on a desktop.",
      ],
    },
  ],
  howTo: [
    { name: "Load the audio", text: "Drop the file onto the page. It is decoded locally for playback and the waveform." },
    { name: "Set start and end", text: "Drag the handles or type exact times. Play the selection to check it." },
    { name: "Trim", text: "Click Trim. The section is copied into a new file without re-encoding." },
    { name: "Download", text: "Save the trimmed audio." },
  ],
  faqs: [
    {
      question: "Does trimming reduce audio quality?",
      answer: "No. The selected audio is copied without re-encoding, so quality is identical to the original.",
    },
    {
      question: "Can I cut out the middle and keep both ends?",
      answer: "Trim the two parts you want as separate files, then join them with the Audio Merger.",
    },
    {
      question: "Why does the cut land a fraction of a second off?",
      answer:
        "Lossless trimming can only cut at compressed-frame boundaries — roughly 26 ms for MP3 and 21 ms for AAC. For sample-accurate cuts, convert to WAV first with the Audio Converter, trim, and convert back.",
    },
    {
      question: "Is my audio uploaded?",
      answer: "No. Everything runs in your browser via FFmpeg compiled to WebAssembly.",
    },
  ],
  related: ["ringtone-maker", "fade-in-out", "audio-merger", "audio-splitter", "silence-remover", "audio-converter"],
};

export default content;
