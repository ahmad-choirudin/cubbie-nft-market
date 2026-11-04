// Formatting helpers shared across the app.

export const pad = (n: number) => String(n).padStart(2, "0");

// Seconds -> [days, "hh", "mm", "ss"] (never negative).
export const splitDhms = (seconds: number): [number, string, string, string] => {
  const s = Math.max(0, Math.floor(seconds));

  return [Math.floor(s / 86400), pad(Math.floor((s % 86400) / 3600)), pad(Math.floor((s % 3600) / 60)), pad(s % 60)];
};

// Seconds -> "hh:mm:ss", or "3d hh:mm:ss" when a day or more remains.
export const formatCountdown = (seconds: number) => {
  const [d, h, m, s] = splitDhms(seconds);

  return `${d > 0 ? `${d}d ` : ""}${h}:${m}:${s}`;
};

// "0x1234567890abcdef" -> "0x1234…cdef".
export const shortAddress = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

// "Cubbie Ninja Chef" -> "cubbie-ninja-chef".
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
