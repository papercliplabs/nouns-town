"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { CustomAvatar } from "@/providers/WalletProvider";

export default function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button variant="secondary" size="md" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button variant="negative" size="md" onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }

              return (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={openAccountModal}
                  className="flex h-fit gap-2 p-1.5 md:h-[54px] md:pl-[12px] md:pr-[24px]"
                >
                  <CustomAvatar address={account.address} size={32} />
                  <span className="hidden md:block">{account.displayName}</span>
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
