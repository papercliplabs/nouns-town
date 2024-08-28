import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-content-primary flex w-full flex-col items-center justify-center gap-4 px-4 py-9 font-bold text-white md:flex-row md:justify-between md:px-12">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
        <Link href="https://www.nounstown.wtf" className="flex gap-1 transition-all hover:scale-105">
          nounstown.wtf
          <Image src="/arrow-up-right-white.svg" width={24} height={24} alt="" />
        </Link>
        <Link href="https://www.nounstown.wtf/terms" className="transition-all hover:scale-105">
          Terms
        </Link>
      </div>
      <div className="flex gap-6">
        <Link href="https://warpcast.com/nounstownla" target="_blank" className="transition-all hover:scale-105">
          <Image src="/farcaster.svg" width={24} height={24} alt="" />
        </Link>
        <Link href="https://x.com/NounsTown" target="_blank" className="transition-all hover:scale-105">
          <Image src="/x.svg" width={24} height={24} alt="" />
        </Link>
      </div>
    </footer>
  );
}
