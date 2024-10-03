import type { Metadata } from "next";
import { Bowlby_One, Karla, Shantell_Sans } from "next/font/google";
import "@/theme/globals.css";
import WalletProvider from "@/providers/WalletProvider";
import "@rainbow-me/rainbowkit/styles.css";
import { Analytics } from "@vercel/analytics/react";

const karla = Karla({ subsets: ["latin"], variable: "--font-karla" });
const bowlbyOne = Bowlby_One({ weight: "400", subsets: ["latin"], variable: "--font-bowlby-one" });
const shantellSans = Shantell_Sans({ subsets: ["latin"], variable: "--font-shantell-sans" });

export const metadata: Metadata = {
  title: "Nouns Town Ticketing",
  description: "NFT Ticketing page for Nouns Town.",
  metadataBase: new URL("https://www.tickets.nounstown.wtf"),
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
        <WalletProvider>{children}</WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
