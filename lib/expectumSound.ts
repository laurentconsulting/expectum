export const EXPECTUM_SOUND_STORAGE_KEY = "expectum_sound_enabled";

export function isExpectumSoundEnabled() {
  if (typeof window === "undefined") return false;

  return localStorage.getItem(EXPECTUM_SOUND_STORAGE_KEY) === "true";
}

export function setExpectumSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;

  localStorage.setItem(EXPECTUM_SOUND_STORAGE_KEY, enabled ? "true" : "false");
}

export function playExpectumSound(_name: "open" | "echo" | "memory" | "direction") {
  if (!isExpectumSoundEnabled()) return;

  // Helikiht on ette valmistatud.
  // Päris helid lisame hiljem teadlikult ja väga vaikselt.
}