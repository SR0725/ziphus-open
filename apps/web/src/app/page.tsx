import Link from "next/link";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/nextui";

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-black ">
      <Header />
      <main className=" container mx-auto flex flex-col items-start py-4 lg:items-center">
        <h1 className="mt-24 text-6xl font-light text-white lg:font-normal">
          <span>視覺化</span>
          <span className=" hidden lg:inline">的</span>
          <span className=" block lg:inline">思維空間</span>
        </h1>
        <p className="text-md z-10 mt-12 text-zinc-300">
          結合了無限空間與結構化筆記功能
        </p>
        <p className="text-md z-10 mt-2 text-zinc-300">
          卡片盒式筆記，組織你的思維
        </p>
        <p className="text-md z-10 mt-2 text-zinc-300">同步編輯、即時協作</p>
        <p className="text-md z-10 mt-2 text-zinc-400">
          請注意，這是最初期的測試版
        </p>
        <p className="text-md z-10 mt-2 text-zinc-400">
          目前只支援電腦、平板操作
        </p>
        <p className="text-md z-10 mt-2 text-zinc-400">
          且可能存在各種未知的問題，歡迎回報至
          <Link
            href="https://discord.gg/sDcyDYjr"
            className="text-blue-400 underline"
          >
            Discord
          </Link>
        </p>
        <div className="z-10">
          <Link href={"/spaces"}>
            <Button
              className="mt-12 border-white text-white"
              color="default"
              size="md"
              variant="bordered"
              aria-label="立即開始，完全免費"
            >
              立即開始，完全免費
            </Button>
          </Link>
        </div>
        <main className="pb-[56.25%] max-w-full h-auto relative mb-64 mt-16 w-full pt-6 overflow-hidden">
          <iframe
            height="480"
            width="853"
            className=" absolute h-full w-full top-0 left-0"
            src="https://www.youtube.com/embed/Bn6C3Zk3Lmw?si=YrnfDnn240Scf8W9"
            title="Ziphus 基本使用｜白板、卡片與無限的創意，視覺化的思維空間"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </main>
      </main>
      <Footer />
    </div>
  );
}
