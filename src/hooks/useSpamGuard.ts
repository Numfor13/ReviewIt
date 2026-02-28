import { useRef } from "react";

export const useSpamGuard = (cooldown = 5000) => {
  const lastSent = useRef<number>(0);

  const canSend = () => {
    const now = Date.now();
    if (now - lastSent.current < cooldown) return false;
    lastSent.current = now;
    return true;
  };

  return { canSend };
};