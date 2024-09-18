import TicketMinter from "@/components/Ticket";
import { CONFIG } from "@/config";
import { TicketYear } from "@/utils/types";
import Image from "next/image";

export default function TicketPage({ params }: { params: { year: string } }) {
  const ticketYear = params.year as any as TicketYear;
  const nftInfo = CONFIG.nftTicketInfo[ticketYear];
  if (!nftInfo) {
    throw Error(`Unsupported ticket year - ${ticketYear}`);
  }

  return (
    <div className="flex max-w-[1200px] flex-col-reverse gap-16 self-center justify-self-center p-4 md:flex-row md:p-10">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-shantell text-[24px] font-bold">Los Angeles, 2024</span>
          <h3>NOUNS TOWN PASS</h3>
        </div>
        <div className="flex flex-col gap-2 font-bold">
          <p>
            This ticket grants you a four-day pass to Nouns Town in Los Angeles, California. While the tickets are free,
            a refundable deposit is required and will be returned upon scanning your ticket at the event.
          </p>
          <p>Please note, this pass does not include access to the Nouns Fest Animation Festival.</p>
        </div>
        <div className="flex gap-4 rounded-2xl bg-[#25BBFF] pl-4 pt-4">
          <Image src="/4156.png" width={140} height={98} alt="" className="object-contain object-bottom" />
          <div className="flex flex-col gap-2 pb-4 pr-4 font-bold">
            <span>Hey Nouns-Holder!</span>
            <span className="caption">
              You don{"'"}t need to mint a ticket. Your Noun already puts you on the guestlist.
            </span>
          </div>
        </div>

        <TicketMinter nftInfo={nftInfo} year={ticketYear} />
      </div>
      <div className="flex h-fit flex-1 justify-center md:w-fit">
        <div className="relative -z-10 flex aspect-square max-h-[280px] w-full max-w-[280px] overflow-hidden rounded-[48px] border-[3px] bg-slate-200 shadow-lg md:max-h-full md:max-w-full">
          <Image src={nftInfo.imgSrc} fill alt="" />
        </div>
      </div>
    </div>
  );
}
