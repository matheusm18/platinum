import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rawgResize(url: string, width: number): string {
  if (!url) return url;
  return url.replace("https://media.rawg.io/media/", `https://media.rawg.io/media/resize/${width}/-/`);
}