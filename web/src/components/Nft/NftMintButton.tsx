"use client";
import { TicketYear } from "@/utils/types";
import { Button } from "../ui/button";
import { CONFIG } from "@/config";

export default function NftMintButton({ year }: { year: TicketYear }) {
  const nftInfo = CONFIG.nftTicketInfo[year];

  return <Button className="sticky bottom-[16px] md:static">Claim</Button>;
}
