import { CONFIG } from "@/config";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { fallback, http } from "viem";

export const wagmiConfig = getDefaultConfig({
  appName: "Nouns Town",
  projectId: "0da7005153f10f8aa038ab9667cdee4d",
  chains: [CONFIG.chain],
  transports: {
    [CONFIG.chain.id]: fallback([http(CONFIG.rpcUrl.primary), http(CONFIG.rpcUrl.fallback)]),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});
