// Human names for the chain ids MetaMask reports (hex strings).
const NAMES: Record<string, string> = {
  "0x1": "Ethereum",
  "0xa": "Optimism",
  "0x89": "Polygon",
  "0x2105": "Base",
  "0xa4b1": "Arbitrum One",
  "0xaa36a7": "Sepolia (testnet)",
  "0x14a34": "Base Sepolia (testnet)",
};

export const chainName = (id: string | null | undefined) =>
  id ? NAMES[id] || `Chain ${parseInt(id, 16)}` : null;
