import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Crop Image Online Free – Precise Photo Cropper, No Upload",
  seoDescription:
    "Crop images online for free. Drag to select the exact area or lock a ratio like 1:1 or 16:9, then download a full-quality PNG. Works with JPG, PNG, WebP — private, nothing uploaded.",
  intro:
    "Cut a photo down to the part that matters. Drag a crop box over the image, resize it freely or lock it to a ratio, and download the result at full resolution. Everything runs on your device using the browser's canvas, so large photos crop instantly and never leave your computer.",
  sections: [
    {
      heading: "Cropping vs resizing",
      paragraphs: [
        "Cropping removes area from the edges of an image while leaving the remaining pixels untouched — nothing is scaled, so sharpness is preserved. Resizing changes the pixel dimensions of the whole image, shrinking or enlarging everything. Use cropping to change composition or aspect ratio (turning a landscape photo into a square profile picture, for example) and resizing to hit a specific size. Doing them in that order — crop first, then resize with the Image Resize tool — gives the cleanest result.",
      ],
    },
    {
      heading: "Common crop sizes and ratios",
      bullets: [
        "1:1 square — Instagram feed posts, profile pictures on most platforms (1080×1080 or 400×400).",
        "4:5 portrait — Instagram portrait posts (1080×1350).",
        "9:16 vertical — Stories, Reels, TikTok covers (1080×1920).",
        "16:9 landscape — YouTube thumbnails (1280×720), blog hero images, presentation slides.",
        "3:1 / 4:1 wide — social media cover and banner images (LinkedIn 1584×396, X 1500×500).",
        "Passport and ID photos — typically 35×45 mm (roughly 7:9) or 2×2 inches (1:1).",
      ],
    },
    {
      heading: "Tips for a better crop",
      bullets: [
        "Use the rule of thirds: place the subject on one of the lines dividing the frame into thirds rather than dead centre.",
        "Leave breathing room in the direction a person is looking or moving.",
        "Avoid cutting through joints — crop mid-limb rather than at knees, elbows or wrists.",
        "Crop before compressing; the Image Compressor can then shrink the file without wasting bytes on discarded areas.",
        "Keep the original — cropping is destructive once you overwrite the source file.",
      ],
    },
  ],
  howTo: [
    { name: "Open an image", text: "Drop a JPG, PNG, WebP or GIF onto the page. It loads locally in your browser." },
    { name: "Select the area", text: "Drag the crop box and resize its edges. Choose a fixed ratio if you need a specific shape." },
    { name: "Crop", text: "Click Crop to render the selection at the image's full native resolution." },
    { name: "Download", text: "Save the cropped image as a PNG." },
  ],
  faqs: [
    {
      question: "Does cropping reduce image quality?",
      answer:
        "No. The pixels inside the crop box are copied exactly as they are; only the area outside is removed. The output is saved as lossless PNG so no compression artefacts are introduced.",
    },
    {
      question: "Is there a maximum image size?",
      answer:
        "Images up to the largest canvas your browser supports — typically 16,000 pixels on a side — can be cropped. Phone photos and DSLR images are well within this range.",
    },
    {
      question: "Can I crop to an exact pixel size?",
      answer:
        "Lock the aspect ratio you need and crop, then use the Image Resize tool to scale the result to the exact width and height.",
    },
    {
      question: "Are my photos uploaded?",
      answer:
        "No. The image is opened and cropped entirely within your browser using the HTML5 canvas; it is never sent to a server.",
    },
  ],
  related: ["image-resize", "image-compressor", "image-converter", "aspect-ratio", "video-cropper", "crop-pdf"],
};

export default content;
