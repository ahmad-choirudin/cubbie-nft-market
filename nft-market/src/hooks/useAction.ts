import { useState } from "react";
import { describeError } from "../utils/web3";

export type ActionState = {
  status: "idle" | "pending" | "success" | "error";
  error: string | null;
};

// Tracks one async wallet action: { status: idle | pending | success | error, error }.
export default function useAction<T = unknown>() {
  const [state, setState] = useState<ActionState>({ status: "idle", error: null });

  const run = async (fn: () => Promise<T>): Promise<T | undefined> => {
    setState({ status: "pending", error: null });

    try {
      const result = await fn();
      setState({ status: "success", error: null });
      return result;
    } catch (error: unknown) {
      setState({ status: "error", error: describeError(error) });
      return undefined;
    }
  };

  return [state, run] as const;
}
