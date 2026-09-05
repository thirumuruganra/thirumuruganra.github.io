import { useEffect, useState } from "react";

// Ticking wall clock. Starts null so SSR/first render stays deterministic,
// then updates once per second.
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}
