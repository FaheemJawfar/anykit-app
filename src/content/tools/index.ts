import type { ToolContent } from "./types";
import ibanValidator from "./iban-validator";
import barcodeGenerator from "./barcode-generator";
import colorNameFinder from "./color-name-finder";
import videoSpeedChanger from "./video-speed-changer";
import videoRotator from "./video-rotator";
import videoTrimmer from "./video-trimmer";
import videoScreenshot from "./video-screenshot";
import audioReverser from "./audio-reverser";
import audioResampler from "./audio-resampler";
import audioEqualizer from "./audio-equalizer";
import loudnessNormalizer from "./loudness-normalizer";
import speedChanger from "./speed-changer";
import volumeAdjuster from "./volume-adjuster";
import audioConverter from "./audio-converter";
import aspectRatio from "./aspect-ratio";
import wordCounter from "./word-counter";
import textUnicode from "./text-unicode";
import keywords from "./keywords";
import integerBaseConverter from "./integer-base-converter";
import emojiPicker from "./emoji-picker";
import wysiwygEditor from "./wysiwyg-editor";
import imageCropper from "./image-cropper";
import markdownEditor from "./markdown-editor";
import markdownToHtml from "./markdown-to-html";
import extractor from "./extractor";
import cropPdf from "./crop-pdf";
import base64File from "./base64-file";

export type { ToolContent, ToolFaq, ToolHowToStep, ToolSection } from "./types";

const registry: Record<string, ToolContent> = {
  "iban-validator": ibanValidator,
  "barcode-generator": barcodeGenerator,
  "color-name-finder": colorNameFinder,
  "video-speed-changer": videoSpeedChanger,
  "video-rotator": videoRotator,
  "video-trimmer": videoTrimmer,
  "video-screenshot": videoScreenshot,
  "audio-reverser": audioReverser,
  "audio-resampler": audioResampler,
  "audio-equalizer": audioEqualizer,
  "loudness-normalizer": loudnessNormalizer,
  "speed-changer": speedChanger,
  "volume-adjuster": volumeAdjuster,
  "audio-converter": audioConverter,
  "aspect-ratio": aspectRatio,
  "word-counter": wordCounter,
  "text-unicode": textUnicode,
  keywords,
  "integer-base-converter": integerBaseConverter,
  "emoji-picker": emojiPicker,
  "wysiwyg-editor": wysiwygEditor,
  "image-cropper": imageCropper,
  "markdown-editor": markdownEditor,
  "markdown-to-html": markdownToHtml,
  extractor,
  "crop-pdf": cropPdf,
  "base64-file": base64File,
};

export function getToolContent(toolId: string): ToolContent | undefined {
  return registry[toolId];
}

export function hasToolContent(toolId: string): boolean {
  return toolId in registry;
}
