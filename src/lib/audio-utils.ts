export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const ms = Math.floor((time % 1) * 10);
  return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms}`;
}

export const mimeMap: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  aac: "audio/aac",
  flac: "audio/flac",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
};

export const codecMap: Record<string, string[]> = {
  mp3: ["-c:a", "libmp3lame", "-b:a", "192k"],
  aac: ["-c:a", "aac", "-b:a", "192k"],
  ogg: ["-c:a", "libvorbis", "-b:a", "192k"],
  m4a: ["-c:a", "aac", "-b:a", "192k"],
  wav: ["-c:a", "pcm_s16le"],
  flac: ["-c:a", "flac"],
};
