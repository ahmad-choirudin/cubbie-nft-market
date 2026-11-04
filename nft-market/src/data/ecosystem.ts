// Cubbie World, the main site of the Cubbie Universe. //
const DEFAULT_WORLD_URL = "https://cubbie.web.id";

const raw = import.meta.env.VITE_CUBBIE_WORLD_URL;
const custom = typeof raw === "string" ? raw.trim() : "";

export const WORLD_URL = /^https:\/\//i.test(custom) ? custom : DEFAULT_WORLD_URL;

export const ECOSYSTEM = [
  { key: "world", label: "Cubbie World", href: WORLD_URL },
  { key: "market", label: "Cubbie Marketplace", href: "#", current: true },
  { key: "tracker", label: "Cubbie Airdrop Tracker", href: "https://www.dropwatch.web.id/" },
  { key: "os", label: "Cubbie Web3 Research OS", href: "https://www.web3os.my.id/" },
];
