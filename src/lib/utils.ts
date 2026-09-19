import { COMMON_WORDS } from "@/data/mockData";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) words.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  return words.join(" ");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}
