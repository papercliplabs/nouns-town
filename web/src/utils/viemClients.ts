import { CONFIG } from "@/config";
import { createClient, fallback, http } from "viem";
import { mainnet } from "viem/chains";

export const mainnetPublicClient = createClient({
  chain: mainnet,
  transport: fallback([
    http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!}`),
    http("https://mainnet.gateway.tenderly.co"),
  ]),
});

export const publicClient = createClient({
  chain: CONFIG.chain,
  transport: fallback([http(CONFIG.rpcUrl.primary), http(CONFIG.rpcUrl.fallback)]),
});
