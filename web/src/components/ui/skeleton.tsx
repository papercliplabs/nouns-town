import { cn } from "@/utils/shadcn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-2xl bg-slate-100/70", className)} {...props} />;
}

export { Skeleton };
