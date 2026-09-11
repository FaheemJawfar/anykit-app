import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Audio Resampler – Change Sample Rate & Bit Depth Online (Free)",
  seoDescription:
    "Resample audio online: convert between 44.1 kHz, 48 kHz, 96 kHz and 192 kHz and switch between 16-bit, 24-bit and 32-bit float. Free, private, runs entirely in your browser.",
  intro:
    "Convert an audio file to a different sample rate or bit depth without installing a DAW. Match a 44.1 kHz music track to a 48 kHz video timeline, downsample high-resolution recordings to CD quality, or prepare 24-bit stems for a studio session. The resampler uses a high-quality filter to avoid aliasing and produces a WAV file you can drop straight into any editor. Processing is local — your audio is not uploaded.",
  sections: [
    {
      heading: "Sample rate vs bit depth",
      paragraphs: [
        "Sample rate is how many times per second the waveform is measured. 44.1 kHz is the CD standard and captures everything up to about 22 kHz — the limit of human hearing. 48 kHz is the standard for video, broadcast and most streaming platforms. 96 kHz and 192 kHz are used in recording and mastering to give plugins more headroom and to allow gentler anti-aliasing filters; they do not make playback sound better on their own.",
        "Bit depth is the precision of each measurement and determines the noise floor. 16-bit gives about 96 dB of dynamic range (CD, most delivery formats). 24-bit gives about 144 dB and is the standard for recording and mixing. 32-bit float effectively cannot clip, making it the safest format for intermediate processing.",
      ],
    },
    {
      heading: "When you need to resample",
      bullets: [
        "Video editing — most NLEs expect 48 kHz; a 44.1 kHz music file can drift or crackle if the software resamples it badly on the fly.",
        "Podcast and audiobook delivery — many platforms require or recommend 44.1 kHz 16-bit.",
        "Game audio — engines often mandate a single rate (commonly 44.1 or 48 kHz) for all assets.",
        "Archiving — downsample 96 kHz field recordings to 48 kHz to halve storage without audible loss.",
        "Collaboration — a session at 48 kHz will play a 44.1 kHz stem at the wrong pitch and speed unless it is converted first.",
      ],
    },
    {
      heading: "Quality notes",
      paragraphs: [
        "Downsampling discards frequencies above the new Nyquist limit; a good resampler filters them out before decimating so they cannot fold back as aliasing distortion. This tool uses FFmpeg's high-precision resampler for exactly that reason. Upsampling cannot add detail that was not recorded, but it is harmless and is often needed for compatibility. Reducing bit depth from 24 to 16 should ideally be the final step in a chain, and the output here is written as uncompressed PCM WAV so nothing is lost after conversion.",
      ],
    },
  ],
  howTo: [
    { name: "Load the audio", text: "Drop in any MP3, WAV, FLAC, AAC, OGG or other audio file. It stays on your device." },
    { name: "Choose a sample rate", text: "Pick 44.1 kHz (CD), 48 kHz (video/studio), 96 kHz (hi-res) or 192 kHz (mastering)." },
    { name: "Choose a bit depth", text: "Select 16-bit, 24-bit or 32-bit float depending on where the file is headed." },
    { name: "Convert and download", text: "Click Resample, preview the result, and download the WAV file." },
  ],
  faqs: [
    {
      question: "Will resampling from 44.1 kHz to 48 kHz improve the sound?",
      answer:
        "No — it cannot add information that was not in the original. It will, however, prevent the pitch drift, clicks and extra resampling artefacts that happen when a video editor or game engine has to convert on the fly.",
    },
    {
      question: "Does converting to 16-bit lose quality?",
      answer:
        "It lowers the noise floor ceiling from roughly 144 dB to 96 dB, which is still far below what is audible in normal listening. For finished music and speech it is the standard delivery depth. Keep 24-bit or 32-bit float only for files you plan to keep processing.",
    },
    {
      question: "What output format do I get?",
      answer:
        "An uncompressed PCM WAV file at the chosen sample rate and bit depth. If you need MP3, FLAC or AAC afterwards, run the WAV through the Audio Converter.",
    },
    {
      question: "Why is my resampled file bigger than the original?",
      answer:
        "The output is uncompressed WAV. An MP3 input is heavily compressed, so its WAV equivalent — especially at 96 kHz 24-bit — will be many times larger. Convert the WAV back to a compressed format if size matters.",
    },
    {
      question: "Is my audio uploaded?",
      answer: "No. Resampling runs in your browser using FFmpeg compiled to WebAssembly; nothing is sent to a server.",
    },
  ],
  related: ["audio-converter", "loudness-normalizer", "volume-adjuster", "channel-mixer", "audio-metadata-editor", "audio-compressor"],
};

export default content;
