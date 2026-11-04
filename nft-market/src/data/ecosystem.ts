// Cubbie World, the main site of the Cubbie Universe. //
const DEFAULT_WORLD_URL = "https://cubbie.web.id";

const raw = import.meta.env.VITE_CUBBIE_WORLD_URL;
const custom = typeof raw === "string" ? raw.trim() : "";

export const WORLD_URL = /^https:\/\//i.test(custom) ? custom : DEFAULT_WORLD_URL;

export const ECOSYSTEM = [
  { key: "world", label: "World", href: WORLD_URL },
  { key: "market", label: "Market", href: "#", current: true },
  { key: "tracker", label: "Tracker", href: null },
  { key: "os", label: "OS", href: null },
];
