"use client";
import { SECONDS_PER_DAY, SECONDS_PER_HOUR } from "@/utils/constants";
import { useEffect, useState } from "react";

interface TimeLeftProps {
  endTimeS: number;
}

export default function TimeLeft({ endTimeS }: TimeLeftProps) {
  const [timeLeftFormatted, setTimeLeftFormatted] = useState<string>(" ");

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = endTimeS - Math.floor(Date.now() / 1000);
      if (timeLeft <= 0) {
        setTimeLeftFormatted("It's go time!");
      } else {
        const days = Math.floor(timeLeft / SECONDS_PER_DAY);
        const hours = Math.floor((timeLeft % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
        const minutes = Math.floor((timeLeft % SECONDS_PER_HOUR) / 60);
        const seconds = timeLeft % 60;

        setTimeLeftFormatted(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return <div className="self-center whitespace-pre font-bold">{timeLeftFormatted}</div>;
}
