import { CONFIG } from "@/config";
import { getNftData } from "@/data/getNftData";
import { TicketYear } from "@/utils/types";

export default async function NftSummary({ year }: { year: TicketYear }) {
  const data = await getNftData({ contractAddress: CONFIG.nftTicketInfo[year].address }); // TODO: contract address

  return (
    <div className="flex w-full items-end justify-between font-bold">
      <div className="flex flex-col gap-2">
        <span>Mint price</span>
        <span className="heading-5">{data.priceFormatted} ETH</span>
      </div>
      <div className="flex">
        <span className="heading-5">{Math.max(data.maxTotalSupply - data.totalSupply, 0)} left!</span>
      </div>
    </div>
  );
}
