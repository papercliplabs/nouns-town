import { getEnsName } from "@/data/getEns";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

export function useEnsName({ address }: { address?: Address }) {
  const ensName = useQuery({
    queryFn: () => getEnsName({ address: address! }),
    queryKey: ["use-ens-avatar", address],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!address,
  });

  return ensName;
}
