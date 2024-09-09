"use client";
import { Button } from "../ui/button";
import { CONFIG, NftInfo } from "@/config";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { eventTicketAbi } from "@/abis/eventTicketAbi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseWriteContractError } from "@/utils/errors";
import { useSwitchChainCustom } from "@/hooks/useSwitchChainCustom";
import { useEffect, useMemo } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { TicketYear } from "@/utils/types";
import Link from "next/link";
import { track } from "@vercel/analytics/react";

interface TicketMintButtonProps {
  salePrice: bigint;
  saleActive: boolean;
  soldOut: boolean;
  userAtMaxPerWallet: boolean;
  nftInfo: NftInfo;
  year: TicketYear;
}

export default function TicketMintButton({
  salePrice,
  saleActive,
  soldOut,
  userAtMaxPerWallet,
  nftInfo,
  year,
}: TicketMintButtonProps) {
  const { openConnectModal } = useConnectModal();

  const {
    data: hash,
    error: writeContractError,
    isPending: isPendingUserAction,
    writeContract,
    reset,
  } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: waitForTransactionReceiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { address, isConnected } = useAccount();
  const { switchChain } = useSwitchChainCustom();
  const router = useRouter();

  // Reset txn on wallet change to clear any errors
  useEffect(() => {
    reset();
  }, [address, reset]);

  useEffect(() => {
    if (isConfirmed) {
      router.push(`/${year}/minted/${hash}`);
    }
  }, [isConfirmed, router, hash, year]);

  useEffect(() => {
    if (hash) {
      track("mint-txn", { hash });
    }
  }, [hash]);

  useEffect(() => {
    if (receipt && receipt.status == "reverted") {
      track("mint-txn-reverted", { hash: receipt.transactionHash });
    }
  }, [receipt]);

  const externalDisabled = useMemo(() => {
    return !saleActive || soldOut || userAtMaxPerWallet;
  }, [saleActive, soldOut, userAtMaxPerWallet]);

  return (
    <div className={clsx("bottom-[16px] z-0 flex w-full flex-col gap-4", !externalDisabled && "sticky")}>
      <Button
        className={clsx("gap-2 md:static", "disabled:bg-[#A9D9F1] disabled:shadow-none")}
        onClick={async () => {
          if (!isConnected) {
            openConnectModal?.();
          } else {
            const correctChain = await switchChain({ chainId: CONFIG.chain.id });
            if (!correctChain) return;

            writeContract({
              abi: eventTicketAbi,
              address: nftInfo.address,
              functionName: "mint",
              value: salePrice,
              chainId: CONFIG.chain.id,
            });
          }
        }}
        disabled={isPendingUserAction || isConfirming || externalDisabled || isConfirmed} // Hold disabled after confirmed while we redirect
      >
        {isPendingUserAction ? (
          <>
            <LoadingSpinner />
            Confirm in wallet
          </>
        ) : isConfirming ? (
          <>
            <LoadingSpinner />
            Processing
          </>
        ) : (
          "Mint Ticket"
        )}
      </Button>
      {(writeContractError || waitForTransactionReceiptError || userAtMaxPerWallet) && (
        <span className="body-md bg-background-primary rounded-full p-2 text-center font-bold text-[#A80000]">
          {userAtMaxPerWallet
            ? "This wallet already holds 1 Nouns Town Pass. You can only hold one pass per wallet."
            : parseWriteContractError(writeContractError, waitForTransactionReceiptError, hash)}
        </span>
      )}
      {(soldOut || !saleActive) && (
        <span className="body-md whitespace-pre-wrap text-center font-bold">
          {soldOut ? "All tickets have been claimed, but more may be released." : "The sale isn't currently active."}{" "}
          Follow us on{" "}
          <Link href="https://x.com/NounsTown" target="_blank" rel="noopener" className="underline hover:opacity-50">
            X
          </Link>{" "}
          or{" "}
          <Link
            href="https://warpcast.com/nounstownla"
            target="_blank"
            rel="noopener"
            className="underline hover:opacity-50"
          >
            Farcaster
          </Link>{" "}
          for updates.
        </span>
      )}
    </div>
  );
}
