import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Audio Metadata Editor Online – Edit MP3 Tags (Title, Artist, Album) Free",
  seoDescription:
    "Edit the ID3 tags of MP3, M4A, FLAC and OGG files in your browser: title, artist, album, year, genre and comment. Fix wrong track info without re-encoding. Free, private, no upload.",
  intro:
    "Fix the track information your music player shows. Load an audio file, edit the title, artist, album, year, genre and comment fields, and download a copy with the new tags — the audio itself is copied through untouched, so there is no quality loss and the process takes a second. Ideal for cleaning up downloads, labelling recordings and podcast episodes, or correcting typos in a library.",
  sections: [
    {
      heading: "What audio metadata is",
      paragraphs: [
        "Every common audio format carries a small block of text fields alongside the sound: ID3 tags in MP3, Vorbis comments in OGG and FLAC, and iTunes-style atoms in M4A/AAC. Players, phones, car stereos and streaming uploaders read these fields to display the track name and artist, to group songs into albums, and to sort by year or genre. When the tags are wrong or missing, a track shows up as \"Unknown Artist – Track 01\" — the file name is not used. This editor writes the standard fields so every player understands them.",
      ],
    },
    {
      heading: "Fields you can edit",
      bullets: [
        "Title — the track or episode name.",
        "Artist — performer or podcast host; use consistent spelling so albums group correctly.",
        "Album — album, compilation or podcast series name.",
        "Year — release year (four digits).",
        "Genre — free text such as Rock, Podcast, Audiobook, Classical.",
        "Comment — notes, source, licence or episode description.",
      ],
    },
    {
      heading: "Tips for a tidy library",
      bullets: [
        "Set Album and Artist identically across every track of a release so players treat them as one album.",
        "For podcasts and audiobooks, put the series in Album and the episode or chapter in Title so they sort correctly.",
        "Keep Genre consistent — most players list every distinct spelling as a separate genre.",
        "Rename the file to match the tags with the Batch File Renamer for a clean folder view.",
        "Tags are preserved when you run the file through the other AnyKit audio tools.",
      ],
    },
  ],
  howTo: [
    { name: "Load the file", text: "Drop an MP3, M4A, FLAC, OGG or WAV file onto the page. Existing tags are read and shown." },
    { name: "Edit the fields", text: "Change title, artist, album, year, genre and comment as needed." },
    { name: "Save", text: "Click Save Metadata. The audio is copied without re-encoding and the new tags are written." },
    { name: "Download", text: "Save the updated file and replace the original in your library." },
  ],
  faqs: [
    {
      question: "Does editing tags change the audio quality?",
      answer: "No. Only the metadata block is rewritten; the encoded audio stream is copied byte for byte.",
    },
    {
      question: "Can I add or change album art?",
      answer: "This editor handles text fields. Embedded artwork is preserved where the format allows, but adding new cover art requires a desktop tagger such as Mp3tag or MusicBrainz Picard.",
    },
    {
      question: "Why does my player still show the old information?",
      answer: "Most players cache tags. Remove the track and re-add it, or rescan the library, so the new metadata is read.",
    },
    {
      question: "Are my files uploaded?",
      answer: "No. Tags are read and written in your browser with FFmpeg compiled to WebAssembly.",
    },
  ],
  related: ["audio-converter", "renamer", "audio-trimmer", "chapter-splitter", "loudness-normalizer", "ringtone-maker"],
};

export default content;
