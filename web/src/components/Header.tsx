import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-background-primary fixed flex h-[80px] w-full items-center justify-between p-4 shadow-lg md:px-10">
      <Link href="https://www.nounstown.wtf" className="flex gap-1 font-bold transition-all hover:scale-105">
        nounstown.wtf
        <Image src="/arrow-up-right.svg" width={24} height={24} alt="" />
      </Link>
      <ConnectWalletButton />
    </header>
  );
}
