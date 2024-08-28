import { Address } from "viem";
import { base, baseSepolia, Chain } from "viem/chains";
import { TicketYear } from "./utils/types";

interface Config {
  chain: Chain;
  rpcUrl: { primary: string; fallback: string };
  nftTicketInfo: Record<
    TicketYear,
    {
      address: Address;
      publicSaleEndDate: Date;
    }
  >;
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
      },
      2025: {
        address: "0x", // TODO
        publicSaleEndDate: new Date("2025-10-10"),
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
        address: "0x", // TODO
        publicSaleEndDate: new Date("2024-10-10"),
      },
      2025: {
        address: "0x", // TODO
        publicSaleEndDate: new Date("2025-10-10"),
      },
    },
  },
};

export const CONFIG = configs[Number(process.env.NEXT_PUBLIC_CHAIN_ID!)];
