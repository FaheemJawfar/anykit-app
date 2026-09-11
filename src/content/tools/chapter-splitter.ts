import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Split Audio by Silence Online – Auto Chapter Splitter for MP3 & WAV",
  seoDescription:
    "Automatically split a long audio file into separate tracks wherever there's a pause. Detects silences of 1, 2 or 3 seconds and exports each chapter or song as its own file. Free, private.",
  intro:
    "Turn one long recording into separate files automatically. The splitter scans the audio for gaps of silence — the pauses between audiobook chapters, songs on a digitised tape or vinyl side, segments of a lecture, or questions in an interview — and cuts at each one, exporting every segment as its own track. Everything runs on your device; nothing is uploaded.",
  sections: [
    {
      heading: "How silence detection works",
      paragraphs: [
        "The tool uses FFmpeg's silencedetect filter with a threshold of -40 dB: any stretch where the level stays below that for at least your chosen minimum duration (1, 2 or 3 seconds) is treated as a gap. The audio is then cut in the middle of each gap so every segment starts and ends cleanly. Choosing the minimum duration is the key setting — too short and natural pauses in speech create dozens of fragments; too long and closely spaced tracks are merged.",
      ],
    },
    {
      heading: "Choosing a minimum silence",
      bullets: [
        "1.0 s — tightly edited content: podcast segments, sound-effect libraries, quiz questions.",
        "2.0 s — the standard gap between tracks on albums, tapes and most audiobook chapters.",
        "3.0 s — recordings with long pauses: lectures, meetings, meditation tracks, or noisy sources where shorter gaps are unreliable.",
      ],
    },
    {
      heading: "Typical projects",
      bullets: [
        "Digitised cassettes, vinyl and MiniDiscs recorded as one file per side.",
        "Audiobook or podcast masters that need chapter files for distribution.",
        "Long voice memos or dictations containing several separate notes.",
        "Radio shows and DJ sets where you want individual songs.",
        "Language-learning audio with one phrase per track.",
        "After splitting, tag each file with the Audio Metadata Editor and name them with the Batch File Renamer.",
      ],
    },
  ],
  howTo: [
    { name: "Load the recording", text: "Drop the long audio file onto the page. It stays on your device." },
    { name: "Choose a minimum silence", text: "Pick 1, 2 or 3 seconds depending on how long the gaps between sections are." },
    { name: "Split", text: "Click Split. The file is scanned and cut at every qualifying pause." },
    { name: "Download", text: "Download each segment, then rename and tag them as needed." },
  ],
  faqs: [
    {
      question: "Nothing was split — why?",
      answer:
        "The gaps are shorter than the minimum you selected, or the background noise is above -40 dB so silence is never detected (common with tape hiss). Try the 1.0 s setting, or run the recording through the Silence Remover or Equalizer first to reduce noise.",
    },
    {
      question: "I got far too many pieces.",
      answer: "Increase the minimum silence to 2 or 3 seconds so pauses in speech are ignored and only real section breaks trigger a cut.",
    },
    {
      question: "Can I set the exact cut points myself?",
      answer: "For manual, precise cuts use the Audio Splitter or the Audio Trimmer; this tool is designed for automatic splitting of long files.",
    },
    {
      question: "Is my recording uploaded?",
      answer: "No. Detection and splitting run in your browser using FFmpeg compiled to WebAssembly.",
    },
  ],
  related: ["audio-splitter", "silence-remover", "audio-trimmer", "audio-metadata-editor", "renamer", "audio-merger"],
};

export default content;
