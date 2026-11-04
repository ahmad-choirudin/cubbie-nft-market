// On-chain settings. Nothing is deployed yet, so by default ONCHAIN_ENABLED is
// false and the site runs in demo mode (simulated collecting, saved locally).
//
// After deploying a contract set, in .env:
//   VITE_CUBBIE_CONTRACT=0x...   (contract address)
//   VITE_CUBBIE_CHAIN_ID=11155111   (decimal chain id, e.g. Sepolia)
const address = (import.meta.env.VITE_CUBBIE_CONTRACT ?? "").trim();
const chain = Number(import.meta.env.VITE_CUBBIE_CHAIN_ID);

export const CONTRACT_ADDRESS = /^0x[a-fA-F0-9]{40}$/.test(address) ? address : null;
export const CHAIN_ID = Number.isInteger(chain) && chain > 0 ? chain : null;
export const CHAIN_ID_HEX = CHAIN_ID ? `0x${CHAIN_ID.toString(16)}` : null;
export const ONCHAIN_ENABLED = Boolean(CONTRACT_ADDRESS && CHAIN_ID);

// Standard ERC-721 reads. Add the real mint or purchase function here when the
// contract exists, for example "function mint(uint256 tokenId) payable".
export const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];
