import { Address } from "viem";

export type NftType = "ticket" | "noun";

export interface User {
  walletAddress: Address;

  name: string;
  email: string;

  nftType: NftType;
  nftId: bigint;
}

export interface Pass {
  user: User;
  url: string;
}
