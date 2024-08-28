import type { Metadata } from "next";
import { Bowlby_One, Karla, Shantell_Sans } from "next/font/google";
import "@/theme/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import WalletProvider from "@/providers/WalletProvider";
import "@rainbow-me/rainbowkit/styles.css";

const karla = Karla({ subsets: ["latin"], variable: "--font-karla" });
const bowlbyOne = Bowlby_One({ weight: "400", subsets: ["latin"], variable: "--font-bowlby-one" });
const shantellSans = Shantell_Sans({ subsets: ["latin"], variable: "--font-shantell-sans" });

export const metadata: Metadata = {
  title: "Nouns Town Ticketing",
  description: "NFT Ticketing page for Nouns Town.",
  metadataBase: new URL("https://tickets.nounstown.wtf"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${karla.variable} ${bowlbyOne.variable} ${shantellSans.variable} bg-background-primary body-md overflow-x-hidden`}
      >
        <WalletProvider>
          <Header />
          <div className="flex min-h-dvh w-full flex-col items-center justify-between pt-[80px]">
            <main className="flex-grow py-8">
              <Image
                src="/cloud.png"
                height={244}
                width={244}
                alt=""
                className="absolute -left-[128px] top-[max(162px,15%)] -z-10 hidden md:block"
                priority
              />
              <Image
                src="/cloud.png"
                height={390}
                width={390}
                alt=""
                className="absolute -right-[134px] top-[min(660px,60%)] -z-10 hidden md:block"
                priority
              />
              {children}
            </main>
            <Footer />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
