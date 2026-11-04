import { CHAIN_ID_HEX, CONTRACT_ABI, CONTRACT_ADDRESS, ONCHAIN_ENABLED } from "../data/web3";
import type { TransactionStatus } from "../types";

interface ErrorDetails {
  code?: number | string;
  shortMessage?: string;
  message?: string;
  info?: { error?: { code?: number | string } };
}

// ethers is loaded only when a contract call needs it, so visitors who never
// touch the chain do not download it.
const loadEthers = () => import("ethers");

export async function getProvider() {
  if (!window.ethereum) throw new Error("No wallet found. Install MetaMask or another EVM wallet.");

  const { BrowserProvider } = await loadEthers();

  return new BrowserProvider(window.ethereum);
}

// Turn wallet and ethers errors into one plain sentence for the user.
export function describeError(error: unknown) {
  const details = error && typeof error === "object" ? error as ErrorDetails : {};
  const code = details.code ?? details.info?.error?.code;
  const text = String(details.shortMessage || details.message || "");

  if (code === 4001 || code === "ACTION_REJECTED") return "You cancelled the request in your wallet.";
  if (code === -32002) return "A request is already open in your wallet. Open your wallet to answer it.";
  if (code === 4902) return "This network is not added to your wallet yet. Add it in your wallet, then try again.";
  if (code === "INSUFFICIENT_FUNDS") return "Not enough ETH to pay for this transaction and its fee.";
  if (code === "NETWORK_ERROR") return "Could not reach the network. Check your connection and try again.";
  if (code === "CALL_EXCEPTION") return "The contract rejected this call.";

  return text || "Something went wrong.";
}

export async function switchChain(chainIdHex = CHAIN_ID_HEX) {
  if (!window.ethereum || !chainIdHex) throw new Error("No network to switch to.");

  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: chainIdHex }],
  });
}

// Read-only: who owns this token? Needs a configured contract.
export async function ownerOf(tokenId: string | number | bigint) {
  if (!ONCHAIN_ENABLED || !CONTRACT_ADDRESS) throw new Error("No contract is configured yet.");

  const { Contract } = await loadEthers();
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, await getProvider());

  return contract.ownerOf(tokenId);
}

// Send a contract transaction and report each stage through onStatus:
// confirm (waiting for the wallet), pending (sent, hash known), confirmed.
// Throws on rejection or revert; show describeError(e) to the user.
// Not used by the UI yet: collecting on this site is still simulated.
export async function sendContractTx(
  method: string,
  args: unknown[] = [],
  options: { value?: string | number | bigint; onStatus?: (status: TransactionStatus) => void } = {}
) {
  const { value, onStatus } = options;
  if (!ONCHAIN_ENABLED || !CONTRACT_ADDRESS) throw new Error("No contract is configured yet.");

  const { Contract } = await loadEthers();
  const signer = await (await getProvider()).getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  onStatus?.({ stage: "confirm" });

  const tx = await contract[method](...args, value != null ? { value } : {});

  onStatus?.({ stage: "pending", hash: tx.hash });

  const receipt = await tx.wait();

  if (receipt?.status !== 1) throw new Error("The transaction failed on the network.");

  onStatus?.({ stage: "confirmed", hash: tx.hash });

  return receipt;
}
