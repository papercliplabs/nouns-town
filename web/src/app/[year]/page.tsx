import NftInfo from "@/components/Nft/NftInfo";
import NftMintButton from "@/components/Nft/NftMintButton";
import NftSummary from "@/components/Nft/NftSummary";
import TimeLeft from "@/components/TimeLeft";
import { Skeleton } from "@/components/ui/skeleton";
import { CONFIG } from "@/config";
import { TicketYear } from "@/utils/types";
import Image from "next/image";
import { Suspense } from "react";

const EVENT_START_TIME_S = 1728457200;

export default function TicketPage({ params }: { params: { year: string } }) {
  const ticketYear = params.year as any as TicketYear;
  const nftInfo = CONFIG.nftTicketInfo[ticketYear];
  if (!nftInfo) {
    throw Error(`Unsupported ticket year - ${ticketYear}`);
  }

  return (
    <div className="flex max-w-[1200px] flex-col-reverse gap-16 self-center p-4 md:flex-row md:p-10">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-shantell text-[24px] font-bold">Tickets</span>
          <h3>NOUNS TOWN PASS</h3>
        </div>
        <span className="font-bold">
          This is the description for the ticket. We need to explain here that its refundable Lorem ipsum dolor sit
          amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </span>
        <div className="flex gap-4 rounded-2xl bg-[#25BBFF] pl-4 pt-4">
          <Image src="/4156.png" width={140} height={98} alt="" className="object-contain object-bottom" />
          <div className="flex flex-col gap-2 pb-4 pr-4 font-bold">
            <span>Do you own a Noun?</span>
            <span className="caption">
              Holders of Nouns don{"'"}t need to claim a ticket. You{"'"}re whitelisted!
            </span>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-[100px] w-full" />}>
          <NftSummary year={ticketYear} />
        </Suspense>

        <NftMintButton year={ticketYear} />

        <TimeLeft endTimeS={EVENT_START_TIME_S} />

        <NftInfo year={ticketYear} />
      </div>
      <div className="flex h-fit flex-1 justify-center md:w-fit">
        <div className="relative -z-10 flex aspect-square max-h-[280px] w-full max-w-[280px] rounded-[48px] border-2 bg-slate-200 shadow-lg md:max-h-full md:max-w-full">
          <Image src="/nft-art.png" fill alt="" />
        </div>
      </div>
    </div>
  );
}
