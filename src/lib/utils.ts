import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rawgResize(url: string, width: number): string {
  if (!url) return url;
  return url.replace(
    "https://media.rawg.io/media/",
    `https://media.rawg.io/media/resize/${width}/-/`,
  );
}

export function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ] as const;

  const rtf = new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" });

  for (const { label, seconds } of units) {
    if (diffInSeconds >= seconds || label === "second") {
      const value = Math.floor(diffInSeconds / seconds);
      return rtf.format(-value, label);
    }
  }
}
