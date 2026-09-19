import type { TestDuration } from "@/types";

export type FontSize = "small" | "medium" | "large";
export interface TypeArcSettings {
  typingCaret: boolean;
  smoothAnimations: boolean;
  defaultDuration: TestDuration;
  fontSize: FontSize;
  showLiveTimer: boolean;
}

export const DEFAULT_SETTINGS: TypeArcSettings = {
  typingCaret: true,
  smoothAnimations: true,
  defaultDuration: 60,
  fontSize: "medium",
  showLiveTimer: true,
};

const STORAGE_KEY = "typearc-settings";

export function loadSettings(): TypeArcSettings {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return DEFAULT_SETTINGS;
    const value = parsed as Partial<TypeArcSettings>;
    return {
      typingCaret: typeof value.typingCaret === "boolean" ? value.typingCaret : DEFAULT_SETTINGS.typingCaret,
      smoothAnimations: typeof value.smoothAnimations === "boolean" ? value.smoothAnimations : DEFAULT_SETTINGS.smoothAnimations,
      defaultDuration: [30, 45, 60, 120].includes(value.defaultDuration as number) ? value.defaultDuration as TestDuration : DEFAULT_SETTINGS.defaultDuration,
      fontSize: ["small", "medium", "large"].includes(value.fontSize as string) ? value.fontSize as FontSize : DEFAULT_SETTINGS.fontSize,
      showLiveTimer: typeof value.showLiveTimer === "boolean" ? value.showLiveTimer : DEFAULT_SETTINGS.showLiveTimer,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TypeArcSettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  document.documentElement.dataset.smoothAnimations = String(settings.smoothAnimations);
  window.dispatchEvent(new Event("typearc-settings"));
}
