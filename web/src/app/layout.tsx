import type { Metadata } from "next";
import { Bowlby_One, Karla } from "next/font/google";
import "@/theme/globals.css";

const karla = Karla({ subsets: ["latin"], variable: "--font-karla" });
const bowlbyOne = Bowlby_One({ weight: "400", subsets: ["latin"], variable: "--font-bowlby-one" });

export const metadata: Metadata = {
  title: "Nouns Town Ticketing",
  description: "NFT Ticketing page for Nouns Town.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${karla.variable} ${bowlbyOne.variable}`}>{children}</body>
    </html>
  );
}
