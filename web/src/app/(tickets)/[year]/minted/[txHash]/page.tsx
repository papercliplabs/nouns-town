import { Button } from "@/components/ui/button";
import { CONFIG } from "@/config";
import { TicketYear } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

const WARPCAST_SOCIAL_SHARE_URL =
  "https://warpcast.com/~/compose?" +
  new URLSearchParams({
    text: "I got my ticket to Nouns Town LA, see you there!",
    "embeds[]": "https://www.tickets.nounstown.wtf",
  }).toString();

const X_SOCIAL_SHARE_URL =
  "https://twitter.com/intent/tweet?" +
  new URLSearchParams({
    text: "I got my ticket to Nouns Town LA, see you there!",
    url: "https://www.tickets.nounstown.wtf",
  }).toString();

export default function AcquiredPage({ params }: { params: { year: string; txHash: string } }) {
  const ticketYear = params.year as any as TicketYear;
  const nftInfo = CONFIG.nftTicketInfo[ticketYear];
  if (!nftInfo) {
    throw Error(`Unsupported ticket year - ${ticketYear}`);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4 md:p-10">
      <Image src={nftInfo.imgSrc} width={160} height={160} alt="" className="rounded-[32px] border-2" />
      <h2>MINTED!</h2>
      <div className="body-lg font-bold">
        View on{" "}
        <Link
          href={CONFIG.chain.blockExplorers?.default.url + `/tx/${params.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-all hover:opacity-70"
        >
          BaseScan
        </Link>
      </div>
      <div className="flex flex-col items-center gap-5">
        <span className="font-bold">Share on:</span>
        <div className="flex gap-6">
          <Button asChild variant="secondary" size="md">
            <Link
              href={WARPCAST_SOCIAL_SHARE_URL}
              target="_blank"
              className="transition-all hover:scale-105"
              rel="noopener"
            >
              <Image src="/farcaster.svg" width={24} height={24} alt="" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="md">
            <Link href={X_SOCIAL_SHARE_URL} target="_blank" className="transition-all hover:scale-105" rel="noopener">
              <Image src="/x.svg" width={24} height={24} alt="" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
