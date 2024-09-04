import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-background-primary fixed flex h-[80px] w-full items-center justify-between p-4 shadow-lg md:px-10">
      <div className="body-lg flex items-center gap-4 font-bold">
        <Link
          href="https://www.nounstown.wtf"
          className="flex gap-1 font-bold transition-all duration-700 ease-out hover:scale-105"
        >
          <Image
            src="/noggles.png"
            width={50.63}
            height={36}
            alt=""
            className="transition-transform hover:rotate-[10deg] hover:scale-110"
          />
        </Link>
        <Link href="https://www.nounstown.wtf/schedule" className="hover:underline">
          Schedule
        </Link>
      </div>
      <ConnectWalletButton />
    </header>
  );
}
