"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("APPLICATION ERROR", error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="flex grow flex-col items-center justify-center gap-2 p-4 text-center">
      <h2>Ooops, something went wrong :(</h2>
      <div className="w-full overflow-hidden text-ellipsis text-nowrap">Error Message: {error.message}</div>
      <Button
        onClick={
          // Attempt to recover by going back home
          () => {
            router.push("/");
          }
        }
      >
        Return Home
      </Button>
    </div>
  );
}
