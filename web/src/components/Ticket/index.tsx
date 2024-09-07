"use client";
import { eventTicketAbi } from "@/abis/eventTicketAbi";
import { NftInfo } from "@/config";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import TicketSummary from "./TicketSummary";
import { formatEther } from "viem";
import TimeLeft from "../TimeLeft";
import { Skeleton } from "../ui/skeleton";
import TicketInfo from "./TicketInfo";
import TicketMintButton from "./TicketMintButton";
import { TicketYear } from "@/utils/types";

interface TicketMinterParams {
  nftInfo: NftInfo;
  year: TicketYear;
}

export default function TicketMinter({ nftInfo, year }: TicketMinterParams) {
  const ticketContract = {
    address: nftInfo.address,
    abi: eventTicketAbi,
  };

  const { address } = useAccount();

  const result = useReadContracts({
    contracts: [
      { ...ticketContract, functionName: "isSaleActive" },
      { ...ticketContract, functionName: "currentSupply" },
      { ...ticketContract, functionName: "maxSupply" },
      { ...ticketContract, functionName: "SALE_PRICE" },
      { ...ticketContract, functionName: "MAX_PER_WALLET" },
    ],
    allowFailure: false,
  });

  const { data: userBalance } = useReadContract({
    ...ticketContract,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address },
  });

  if (!result.data) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const [saleActive, currentSupply, maxSupply, price, maxPerWallet] = result.data;

  return (
    <>
      <TicketSummary
        priceFormatted={formatEther(price)}
        currentSupply={Number(currentSupply)}
        maxSupply={Number(maxSupply)}
      />

      <TicketMintButton
        salePrice={price}
        saleActive={saleActive}
        soldOut={currentSupply == maxSupply}
        userAtMaxPerWallet={userBalance == maxPerWallet}
        nftInfo={nftInfo}
        year={year}
      />

      <TimeLeft endTimeS={Math.floor(nftInfo.publicSaleEndDate.getTime() / 1000)} />

      <TicketInfo nftInfo={nftInfo} />
    </>
  );
}
