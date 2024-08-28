import { getEnsAvatar } from "@/data/getEns";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

export function useEnsAvatar({ address }: { address?: Address }) {
  const ensAvatar = useQuery({
    queryFn: () => getEnsAvatar({ address: address! }),
    queryKey: ["use-ens-avatar", address],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!address,
  });

  return ensAvatar;
}
