import { NftType } from "./types";
import { Address, Client, erc721Abi } from "viem";
import { multicall, writeContract } from "viem/actions";
import dotenv from "dotenv";
import { eventTicketAbi } from "./abis/eventTicketAbi";
import { eventTicketRedeemerAbi } from "./abis/eventTicketRedeemerAbi";
import { basePublicClient, mainnetPublicClient, redeemerWalletClient } from "./viemClients";

dotenv.config();

const NFT_TYPE_INFO: Record<
  NftType,
  {
    client: Client;
    contractAddress: Address;
  }
> = {
  noun: {
    client: mainnetPublicClient,
    contractAddress: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
  },
  ticket: {
    client: basePublicClient,
    contractAddress: "0x04Db84527ecC5414B7FaDaeBE03fcADD978Ef5dF",
  },
};

const REDEEMER_ADDRESS = "0x172E9C1b8521DEa96ea356132b0f12E0e4e12b40";

export async function getNftOwners(nftType: NftType, ids: bigint[]): Promise<Address[]> {
  const info = NFT_TYPE_INFO[nftType];

  const owners = multicall(info.client, {
    contracts: ids.map((id) => ({
      abi: erc721Abi,
      address: info.contractAddress,
      functionName: "ownerOf",
      args: [id],
    })) as {
      abi: typeof erc721Abi;
      address: Address;
      functionName: "ownerOf";
      args: [bigint];
    }[],
    allowFailure: false,
  });

  return owners;
}

export async function getAreTicketNftsRedeemed(ids: bigint[]): Promise<boolean[]> {
  const info = NFT_TYPE_INFO["ticket"];

  const redeemed = multicall(info.client, {
    contracts: ids.map((id) => ({
      abi: eventTicketAbi,
      address: info.contractAddress,
      functionName: "redeemedTokens",
      args: [id],
    })) as {
      abi: typeof eventTicketAbi;
      address: Address;
      functionName: "redeemedTokens";
      args: [bigint];
    }[],
    allowFailure: false,
  });

  return redeemed;
}

export async function redeemTicketNfts(ids: bigint[]) {
  await writeContract(redeemerWalletClient, {
    abi: eventTicketRedeemerAbi,
    address: REDEEMER_ADDRESS,
    functionName: "redeemBatch",
    args: [ids],
  });
}
