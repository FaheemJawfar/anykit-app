import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Stereo to Mono Converter Online – Audio Channel Mixer, Free",
  seoDescription:
    "Convert stereo audio to mono, or keep only the left or right channel, in your browser. Fix one-sided recordings and prepare files for podcasts, phones and voice systems. Free, no upload.",
  intro:
    "Remix the channels of an audio file: fold stereo down to mono, or isolate just the left or right channel. This fixes recordings where the microphone only captured one side, prepares voice files for phone systems and podcast platforms that expect mono, and halves the size of speech recordings that never needed two channels. Processing is done on your device.",
  sections: [
    {
      heading: "Channel options",
      bullets: [
        "Stereo → Mono — averages left and right (0.5 × L + 0.5 × R) into a single channel so nothing is lost and levels stay balanced.",
        "Left only — outputs a mono file containing just the left channel; use when the right channel is empty, noisy or a different source.",
        "Right only — the mirror of the above.",
        "Keep stereo — passes both channels through, useful when combining with the other tools' output.",
      ],
    },
    {
      heading: "When mono is the right choice",
      paragraphs: [
        "Speech has no meaningful stereo information, so podcasts, audiobooks, voice memos, IVR prompts and lecture recordings are almost always delivered in mono. Mono files are half the size of stereo at the same bitrate, play identically on single-speaker devices such as phones and smart speakers, and avoid the disorienting effect of a voice recorded on one side only. Many podcast hosts recommend mono at 64–96 kbps; Apple's loudness recommendation for mono is -19 LUFS.",
        "Music, film soundtracks and field recordings, by contrast, rely on stereo placement — keep those in stereo unless a platform explicitly requires mono.",
      ],
    },
    {
      heading: "Fixing one-sided audio",
      paragraphs: [
        "A common problem with USB interfaces, lavalier microphones and some phone adapters is audio that plays only in the left or right ear. That happens when a mono microphone is recorded into a stereo track, leaving one channel silent. Choosing Left only or Right only (whichever contains the sound) outputs a clean mono file that plays centred in both ears. If both channels contain different recordings — say two interview participants — split them by exporting Left only and Right only separately, then edit each.",
      ],
    },
  ],
  howTo: [
    { name: "Load the audio", text: "Drop an MP3, WAV, FLAC, AAC or OGG file onto the page." },
    { name: "Pick the channel mode", text: "Choose Mono, Left only, Right only or Stereo." },
    { name: "Process", text: "Click Apply; the channels are remixed locally with FFmpeg." },
    { name: "Download", text: "Listen to the result and save the file." },
  ],
  faqs: [
    {
      question: "Does converting to mono lose quality?",
      answer:
        "Averaging the channels loses only the stereo placement, not fidelity. For speech there is no audible difference; for music, instruments panned hard left or right will sit in the centre instead.",
    },
    {
      question: "Why does my recording only play in one ear?",
      answer:
        "A mono microphone was recorded onto a stereo track, leaving the other channel silent. Choose Left only or Right only — whichever has the audio — to get a centred mono file.",
    },
    {
      question: "Can I turn mono back into stereo?",
      answer:
        "A mono file can be played through both speakers (which is what happens automatically), but genuine stereo separation cannot be recreated. Use the Audio Effects Studio to add width or reverb if you want a more spacious feel.",
    },
    {
      question: "Why do some stereo songs sound thin or quiet in mono?",
      answer:
        "If the left and right channels contain out-of-phase content, summing them cancels parts of the signal. That is a property of the original mix; check the mono result and adjust with the Volume Adjuster or Equalizer if needed.",
    },
  ],
  related: ["volume-adjuster", "loudness-normalizer", "audio-converter", "audio-splitter", "voice-isolator", "audio-resampler"],
};

export default content;
