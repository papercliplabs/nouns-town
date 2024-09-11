import { NftInfo } from "@/config";
import { formatAddress } from "@/utils/format";
import { publicClient } from "@/utils/viemClients";
import Image from "next/image";
import Link from "next/link";

export default function TicketInfo({ nftInfo }: { nftInfo: NftInfo }) {
  return (
    <div className="flex flex-col gap-2 rounded-[24px] border-2 border-[#25BBFF] p-6 font-bold">
      <div className="flex justify-between">
        <span>Max per address</span>
        <span>1</span>
      </div>
      <div className="flex justify-between">
        <span>Ticket claim ends</span>
        <span>
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          }).format(nftInfo.publicSaleEndDate)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Contract address</span>
        <Link
          href={publicClient.chain.blockExplorers?.default.url + `/address/${nftInfo.address}`}
          target="_blank"
          className="flex gap-1"
        >
          {formatAddress(nftInfo.address)}
          <Image src="/arrow-up-right.svg" width={24} height={24} alt="" />
        </Link>
      </div>
      <div className="flex justify-between">
        <span>Network</span>
        <span>{publicClient.chain.name}</span>
      </div>
    </div>
  );
}
