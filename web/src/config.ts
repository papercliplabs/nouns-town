import { Address } from "viem";
import { base, baseSepolia, Chain } from "viem/chains";
import { TicketYear } from "./utils/types";

export interface NftInfo {
  address: Address;
  publicSaleEndDate: Date;
  imgSrc: string;
}

interface Config {
  chain: Chain;
  rpcUrl: { primary: string; fallback: string };
  nftTicketInfo: Record<TicketYear, NftInfo>;
}

const configs: Record<number, Config> = {
  [base.id]: {
    chain: base,
    rpcUrl: {
      primary: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`,
      fallback: `https://mainnet.base.org`,
    },
    nftTicketInfo: {
      2024: {
        address: "0x", // TODO
        publicSaleEndDate: new Date("2024-10-10"),
        imgSrc: "/ticket-2024.gif",
      },
      2025: {
        address: "0x", // TODO
        publicSaleEndDate: new Date("2025-10-10"),
        imgSrc: "",
      },
    },
  },
  [baseSepolia.id]: {
    chain: baseSepolia,
    rpcUrl: {
      primary: `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`,
      fallback: `https://sepolia.base.org`,
    },
    nftTicketInfo: {
      2024: {
        address: "0x64c1aF051aDB77C4091C073eFdDc86d140131fde",
        publicSaleEndDate: new Date("2024-10-10"),
        imgSrc: "/ticket-2024.gif",
      },
      2025: {
        address: "0x", // TODO
        publicSaleEndDate: new Date("2025-10-10"),
        imgSrc: "",
      },
    },
  },
};

export const CONFIG = configs[Number(process.env.NEXT_PUBLIC_CHAIN_ID!)];
