export const STORAGE_KEYS = {
  owned: "cubbie-owned",
  liked: "cubbie-liked",
  created: "cubbie-created",
  walletOff: "cubbie-wallet-off",
  history: "cubbie-history",
  profile: "cubbie-profile",
};

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

// Returns true when the value was stored.
export function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeFlag(key: string, on: boolean) {
  try {
    if (on) {
      localStorage.setItem(key, "1");
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Local storage unavailable.
  }
}