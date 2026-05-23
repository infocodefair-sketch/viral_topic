"use client";

import { useEffect, useState } from "react";

function nextWatchingNow() {
  return 2000 + Math.floor(Math.random() * 98000);
}

export function WatchingNowCounter() {
  const [count, setCount] = useState(2400);

  useEffect(() => {
    const firstUpdate = window.setTimeout(() => setCount(nextWatchingNow()), 600);
    const interval = window.setInterval(() => setCount(nextWatchingNow()), 5000);

    return () => {
      window.clearTimeout(firstUpdate);
      window.clearInterval(interval);
    };
  }, []);

  return <p className="font-mono text-2xl font-black text-orange-300">{count.toLocaleString("en-US")}</p>;
}
