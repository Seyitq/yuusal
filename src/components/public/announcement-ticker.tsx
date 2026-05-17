"use client";

import { useEffect, useState } from "react";

export function AnnouncementTicker({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <p className="text-xs tracking-widest uppercase font-sans text-center px-4">
      {messages[index]}
    </p>
  );
}
