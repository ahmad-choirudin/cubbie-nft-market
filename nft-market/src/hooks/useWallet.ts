import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS, readFlag, writeFlag } from "../utils/storage";
import { CHAIN_ID_HEX, ONCHAIN_ENABLED } from "../data/web3";
import { describeError } from "../utils/web3";

const walletOff = {
  get: () => readFlag(STORAGE_KEYS.walletOff),
  set: (on: boolean) => writeFlag(STORAGE_KEYS.walletOff, on),
};

// Networks whose native currency is ETH, so the balance label is accurate.
const ETH_CHAINS = new Set(["0x1", "0xa", "0x2105", "0xa4b1", "0xaa36a7", "0x14a34"]);

export default function useWallet() {
  const [acc, setAcc] = useState<string | null>(null);
  const [bal, setBal] = useState<string | null>(null);
  const [chain, setChain] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const loadRequest = useRef(0);

  const load = useCallback(async (address: string | null) => {
    const requestId = ++loadRequest.current;
    setAcc(address);

    if (!address) {
      setBal(null);
      setChain(null);
      setBalanceError(null);
      return;
    }

    setBalanceError(null);

    try {
      const provider = window.ethereum;
      if (!provider) throw new Error("Wallet not found.");

      const [balance, network] = await Promise.all([
        provider.request<string>({ method: "eth_getBalance", params: [address, "latest"] }),
        provider.request<string>({ method: "eth_chainId" }),
      ]);

      if (requestId !== loadRequest.current) return;

      const wei = BigInt(balance);
      if (wei < 0n) throw new Error("Invalid wallet balance.");

      const milliEth = (wei + 500_000_000_000_000n) / 1_000_000_000_000_000n;
      setBal(`${milliEth / 1000n}.${String(milliEth % 1000n).padStart(3, "0")}`);
      setChain(network);
    } catch (error: unknown) {
      if (requestId !== loadRequest.current) return;

      setBal(null);
      setChain(null);
      setBalanceError(describeError(error));
    }
  }, []);

  useEffect(() => {
    const e = window.ethereum;

    if (!e) return;
    let active = true;

    const sync = () => {
      e.request<string[]>({ method: "eth_accounts" })
        .then((accounts) => {
          if (active) void load(accounts[0] || null);
        })
        .catch((error: unknown) => {
          if (active) setBalanceError(describeError(error));
        });
    };

    if (!walletOff.get()) sync();

    const onAcc = (accounts: string[]) => {
      if (!walletOff.get()) {
        load(accounts[0] || null);
      }
    };

    const onChain = (_chainId: string) => {
      if (!walletOff.get()) sync();
    };

    e.on?.("accountsChanged", onAcc);
    e.on?.("chainChanged", onChain);

    return () => {
      active = false;
      loadRequest.current += 1;
      e.removeListener?.("accountsChanged", onAcc);
      e.removeListener?.("chainChanged", onChain);
    };
  }, [load]);

  const connect = async () => {
    const provider = window.ethereum;
    if (!provider) {
      throw new Error("Wallet not found. Please install MetaMask first.");
    }

    const accounts = await provider.request<string[]>({
      method: "eth_requestAccounts",
    });

    walletOff.set(false);
    await load(accounts[0] || null);
  };

  const disconnect = async () => {
    walletOff.set(true);
    load(null);

    // Best effort: ask the wallet to revoke this site's access too.
    // Not every wallet supports it, so failures are ignored.
    try {
      await window.ethereum?.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch {
      // Unsupported or declined: the site still stops using the account.
    }
  };

  return {
    acc,
    bal,
    chain,
    balanceError,
    // True only when the balance is denominated in ETH.
    ethBalance: bal !== null && chain !== null && ETH_CHAINS.has(chain),
    // True when a contract is configured and the wallet is on another network.
    wrongChain:
      ONCHAIN_ENABLED &&
      Boolean(acc) &&
      chain !== null &&
      chain.length > 0 &&
      CHAIN_ID_HEX !== null &&
      chain.toLowerCase() !== CHAIN_ID_HEX,
    connect,
    disconnect,
  };
}
