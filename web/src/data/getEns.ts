"use server";
import { Address } from "viem";
import { unstable_cache } from "next/cache";
import { normalize } from "viem/ens";
import { getEnsName as getViemEnsName, getEnsAvatar as getViemEnsAvatar } from "viem/actions";
import { SECONDS_PER_WEEK } from "@/utils/constants";
import { mainnetPublicClient } from "@/utils/viemClients";

export interface EnsInfoParams {
  address: Address;
}

async function getEnsNameUncached({ address }: EnsInfoParams): Promise<string | null> {
  const ensName = await getViemEnsName(mainnetPublicClient, { address });
  return ensName ?? null;
}

export const getEnsName = unstable_cache(getEnsNameUncached, ["get-ens-name"], {
  revalidate: SECONDS_PER_WEEK,
});

async function getEnsAvatarUncached({ address }: EnsInfoParams): Promise<string | null> {
  const ensName = await getEnsName({ address });
  const ensAvatar = ensName ? await getViemEnsAvatar(mainnetPublicClient, { name: normalize(ensName) }) : undefined;

  return ensAvatar ?? null;
}

export const getEnsAvatar = unstable_cache(getEnsAvatarUncached, ["get-ens-avatar"], {
  revalidate: SECONDS_PER_WEEK,
});
