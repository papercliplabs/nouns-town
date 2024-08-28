"use client";

import { AvatarComponent, darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { getLinearGradientForAddress } from "@/utils/colors";
import { Address } from "viem";
import { useEnsAvatar } from "@/hooks/useEnsAvatar";
import { wagmiConfig } from "@/utils/wagmiConfig";

export const CustomAvatar: AvatarComponent = ({ address, size }) => {
  const { data: ensAvatar } = useEnsAvatar({ address: address as Address });
  const linearGradient = getLinearGradientForAddress(address as Address);
  return ensAvatar ? (
    <Image src={ensAvatar} width={size} height={size} alt="" style={{ borderRadius: 999, width: size, height: size }} />
  ) : (
    <div
      style={{
        background: linearGradient,
        borderRadius: 999,
        height: size,
        width: size,
      }}
    />
  );
};

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider avatar={CustomAvatar} theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
