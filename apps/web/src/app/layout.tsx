import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Noto_Sans_TC } from "next/font/google";
import { Toaster } from "sonner";
import { NextUIProvider } from "@/components/nextui";
import ReactQueryProvider from "@/providers/react-query";
import { cn } from "@/utils/cn";
import "./globals.css";


const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ziphus",
  applicationName: "Ziphus",
  description: `Ziphus 是一款創新的筆記軟體，旨在打造一個結合了 Miro 的無限空間與 Notion 的結構化筆記功能的理想寫作環境。每份筆記都支援繪圖功能，讓用戶能夠在筆記中直接畫圖、標注重點或書寫文字，極大地豐富了筆記的表達方式。為了滿足不同用戶的需求，Ziphus 還對 iPad 進行了優化，確保在觸控設備上也能提供流暢的使用體驗。
最後，Ziphus 支持多人同步編輯功能，無論是工作團隊還是學習小組，都可以實時協作，共同編輯和更新筆記，使得協作更加高效無縫。`,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ziphus",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="zh-Hant" data-color-mode="dark">
      <body className={cn(notoSansTC.className, "dark")}>
        <NextUIProvider>
          <ReactQueryProvider>
            <Toaster position="top-right" richColors closeButton />
            <>{children}</>
          </ReactQueryProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}