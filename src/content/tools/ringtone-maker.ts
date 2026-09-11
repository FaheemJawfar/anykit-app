import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Ringtone Maker Online – Make iPhone (M4R) & Android (MP3) Ringtones Free",
  seoDescription:
    "Turn any song into a ringtone in your browser. Pick the start point, choose 5, 15 or 30 seconds, and export as M4R for iPhone or MP3 for Android with automatic fades. Free, no upload.",
  intro:
    "Make a custom ringtone from any song or recording without iTunes, GarageBand or an app-store subscription. Choose where the ringtone should start, pick a length, and export in the right format — M4R for iPhone or MP3 for Android — with automatic fade in and fade out so it doesn't start or stop abruptly. The audio is processed on your device and never uploaded.",
  sections: [
    {
      heading: "iPhone vs Android formats",
      bullets: [
        "iPhone — ringtones must be AAC audio in an .m4r file (an MP4 container with a special extension) and no longer than 40 seconds; the 30-second preset is the safe standard. Alert tones are typically under 30 seconds.",
        "Android — accepts MP3, M4A, OGG and WAV of any reasonable length; 30 seconds is plenty because calls stop ringing before that.",
        "The tool picks the right codec automatically: choosing M4R encodes to AAC; choosing MP3 encodes to MP3.",
      ],
    },
    {
      heading: "Installing your ringtone",
      bullets: [
        "iPhone (Mac or PC with Finder/iTunes): connect the phone, drag the .m4r file onto the device in the sidebar, then choose it in Settings → Sounds & Haptics → Ringtone.",
        "iPhone (no computer): save the .m4r to the Files app, open it in GarageBand via Share → Ringtone, or use any \"ringtone import\" shortcut; the file appears under Ringtones.",
        "Android: copy the MP3 to the Ringtones folder (or use the Files app), then Settings → Sound → Phone ringtone → Add / My Sounds. Many phones also let you set a ringtone directly from the file's share menu.",
        "Custom per-contact tones: open the contact, tap Edit → Ringtone and choose your new file.",
      ],
    },
    {
      heading: "Making it sound good",
      bullets: [
        "Start on a downbeat or at the beginning of a phrase — the chorus or the hook is usually ideal.",
        "Fades are applied automatically (up to two seconds, scaled to the clip length) to avoid clicks and abrupt endings.",
        "Choose a section with a strong, consistent level so the ringtone is audible in a pocket; quiet intros make poor ringtones.",
        "Shorter clips (15 s) loop more naturally on phones that repeat the tone.",
      ],
    },
  ],
  howTo: [
    { name: "Add a song", text: "Drop an MP3, M4A, WAV, FLAC or OGG file onto the page." },
    { name: "Pick the start", text: "Scrub to the moment the ringtone should begin and preview it." },
    { name: "Choose length and format", text: "Select 5, 15 or 30 seconds and M4R (iPhone) or MP3 (Android)." },
    { name: "Create and download", text: "Click Create Ringtone, then save the file and install it on your phone." },
  ],
  faqs: [
    {
      question: "Why won't my iPhone see the ringtone?",
      answer:
        "Check that the file has the .m4r extension and is 40 seconds or shorter, and that you added it via Finder/iTunes or GarageBand rather than just saving it to Files. Restarting the Settings app sometimes refreshes the list.",
    },
    {
      question: "Can I make a ringtone from a YouTube video or streaming song?",
      answer:
        "You need an audio file you own or are permitted to use. Extract the soundtrack from your own videos with the Extract Audio tool, then make the ringtone here.",
    },
    {
      question: "Is there a length limit?",
      answer: "iPhone ringtones must be under 40 seconds; the presets keep you within that. Android has no strict limit but 30 seconds is the practical maximum.",
    },
    {
      question: "Is my music uploaded?",
      answer: "No. Trimming, fading and encoding all happen in your browser with FFmpeg compiled to WebAssembly.",
    },
  ],
  related: ["audio-trimmer", "fade-in-out", "audio-converter", "extract-audio", "volume-adjuster", "speed-changer"],
};

export default content;
