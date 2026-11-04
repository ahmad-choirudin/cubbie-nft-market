import { useEffect, useRef, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "../utils/storage";
import type { Dispatch, SetStateAction } from "react";
import type { Profile } from "../types";

// Collector profile kept in this browser: a display name and the date of the
// first visit. Nothing is sent anywhere.
export default function useProfile(onWriteError?: () => void): [Profile, Dispatch<SetStateAction<Profile>>] {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = readJSON<unknown>(STORAGE_KEYS.profile, null);
    const p = saved && typeof saved === "object" && "since" in saved && typeof saved.since === "string"
      ? saved as { since: string; name?: unknown }
      : null;

    return p
      ? { name: typeof p.name === "string" ? p.name : "", since: p.since }
      : { name: "", since: new Date().toISOString() };
  });

  const first = useRef(true);
  const errorRef = useRef(onWriteError);
  errorRef.current = onWriteError;

  useEffect(() => {
    const ok = writeJSON(STORAGE_KEYS.profile, profile);

    if (!ok && !first.current) errorRef.current?.();
    first.current = false;
  }, [profile]);

  return [profile, setProfile];
}
