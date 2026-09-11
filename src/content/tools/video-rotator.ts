import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Rotate Video Online Free – Fix Sideways or Upside-Down Videos",
  seoDescription:
    "Rotate a video 90°, 180° or 270° and flip it horizontally or vertically — online, free and private. Fix sideways phone videos in your browser with no upload and no watermark.",
  intro:
    "Fix a video that was recorded sideways or upside down, or mirror a clip for a creative effect. Rotate in 90-degree steps, flip horizontally or vertically, preview the result, and download a standard MP4 that plays correctly everywhere — including players that ignore the rotation flag phones embed in their files. The video is processed entirely on your device.",
  sections: [
    {
      heading: "Why phone videos play sideways",
      paragraphs: [
        "Smartphones always record in the sensor's native orientation and simply write a \"rotate by 90°\" tag into the file's metadata. Most phone galleries and modern players honour that tag, but many desktop players, editing tools, web uploaders and older TVs ignore it — so the video appears turned on its side. This tool physically re-encodes the frames in the correct orientation and clears the rotation tag, which makes the file display correctly regardless of the player.",
      ],
    },
    {
      heading: "Rotate vs flip",
      bullets: [
        "Rotate 90° clockwise / counter-clockwise — turns a portrait clip into landscape or vice versa; the width and height swap.",
        "Rotate 180° — fixes footage shot upside down, for example from an inverted mount.",
        "Flip horizontal (mirror) — reverses left and right, useful for un-mirroring selfie-camera footage so text reads correctly.",
        "Flip vertical — reverses top and bottom without rotating.",
        "Rotation and flips can be combined; the preview updates before you process anything.",
      ],
    },
    {
      heading: "Quality and format",
      paragraphs: [
        "Rotation requires re-encoding, because the pixel data itself is rearranged. The output is H.264 MP4 with a quality setting chosen to be visually indistinguishable from the source for typical phone and screen-recorded footage. The audio track is copied through untouched. Input can be MP4, MOV, WebM, MKV, AVI, 3GP and most other formats a browser can decode.",
      ],
    },
  ],
  howTo: [
    { name: "Choose your video", text: "Drag the file in or click to select it. Nothing is uploaded to a server." },
    { name: "Pick a rotation", text: "Select 90°, 180° or 270°, and optionally a horizontal or vertical flip. The preview shows the new orientation." },
    { name: "Process", text: "Click rotate and wait for the progress bar to finish." },
    { name: "Download", text: "Check the result in the player and save the corrected MP4." },
  ],
  faqs: [
    {
      question: "Why does my video look fine on my phone but sideways on my computer?",
      answer:
        "Your phone stored a rotation tag in the file's metadata rather than rotating the pixels. Your phone respects the tag, but the desktop player does not. Rotating the video here bakes the correct orientation into the frames so it looks right everywhere.",
    },
    {
      question: "Does rotating reduce video quality?",
      answer:
        "The video is re-encoded once at a high-quality setting, so any loss is very small and typically invisible. The audio is not re-encoded at all.",
    },
    {
      question: "Can I rotate by an arbitrary angle like 15°?",
      answer:
        "This tool rotates in 90° steps, which is what orientation fixes need. Arbitrary angles introduce black corners and cropping and are better handled in a full video editor.",
    },
    {
      question: "Is there a size limit or watermark?",
      answer:
        "No watermark and no upload limit, because processing runs on your own device with FFmpeg compiled to WebAssembly. Very long or 4K files simply take longer.",
    },
  ],
  related: ["video-cropper", "aspect-ratio-converter", "video-trimmer", "video-converter", "video-compressor", "mute-video"],
};

export default content;
