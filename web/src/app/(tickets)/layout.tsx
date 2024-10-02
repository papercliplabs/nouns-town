import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex min-h-dvh w-full flex-col items-center justify-between pt-[80px]">
        <main className="flex w-full flex-grow justify-center py-8">
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
    </>
  );
}
