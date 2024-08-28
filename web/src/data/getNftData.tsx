"use server";
import { unstable_cache } from "next/cache";
import { Address } from "viem";

interface GetNftInfoParams {
  contractAddress: Address;
}

interface NftInfo {
  priceFormatted: string;
  totalSupply: number;
  maxTotalSupply: number;
}

async function getNftDataUncached({ contractAddress }: GetNftInfoParams): Promise<NftInfo> {
  // TODO: actually fetch the data

  return {
    priceFormatted: "0.1",
    totalSupply: 100,
    maxTotalSupply: 150,
  };
}

export const getNftData = unstable_cache(getNftDataUncached, ["get-nft-data"], { revalidate: 300 }); // 5 min + on mint
