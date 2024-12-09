import path from "path";

export const videoExtensions = [".m4v", ".mp4", ".mov"];

export type MediaType = "image" | "video";

export const getMediaType = (uri: string) => {
  return videoExtensions.includes(path.extname(uri)) ? "video" : "image";
};
