"use client";
import { SECONDS_PER_DAY, SECONDS_PER_HOUR } from "@/utils/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TimeLeftProps {
  endTimeS: number;
}

export default function TimeLeft({ endTimeS }: TimeLeftProps) {
  const [timeLeftFormatted, setTimeLeftFormatted] = useState<string | undefined>(" ");

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = endTimeS - Math.floor(Date.now() / 1000);
      if (timeLeft <= 0) {
        setTimeLeftFormatted(undefined);
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

  return (
    <div className="self-center whitespace-pre-wrap text-center font-bold">
      {timeLeftFormatted != undefined ? (
        timeLeftFormatted
      ) : (
        <>
          If you already minted a ticket, claim your pass{" "}
          <Link
            href="https://nounstown.deform.cc/claim2024pass/"
            target="_blank"
            className="underline transition-all hover:brightness-75"
            rel="noopener"
          >
            here
          </Link>
          !
        </>
      )}
    </div>
  );
}
