import { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/footer";
import Header from "@/components/header";
import "./style.css";

export const metadata: Metadata = {
  title: "Privacy | Ziphus",
};

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-black ">
      <Header />
      <main className="container mx-auto mb-96 flex flex-col items-start py-4 text-white">
        <h1 className=" mb-2 text-3xl">Ziphus 隱私權政策</h1>
        <p>更新日期：2024/4/10</p>

        <p>
          歡迎使用
          Ziphus！我們致力於保護您的隱私和數據。本隱私政策旨在透明地解釋我們如何收集、使用、儲存、分享和保護您的個人訊息，以及您對您的訊息擁有的權利。
        </p>

        <h2>1. 訊息的收集和使用</h2>
        <h3>1.1 收集的訊息類型</h3>
        <ul>
          <li>
            <strong>帳戶訊息：</strong>您在創建 Ziphus
            帳戶時提供的訊息，如您的姓名、電子郵件地址、密碼等。
          </li>
          <li>
            <strong>內容訊息：</strong>您在使用 Ziphus
            時創建或分享的筆記、圖片、視頻和其他內容。
          </li>
          <li>
            <strong>使用數據：</strong>我們收集有關您如何訪問和使用 Ziphus
            的訊息，包括訪問時間、瀏覽的頁面、使用的功能等。
          </li>
          <li>
            <strong>設備訊息：</strong>
            我們可能會收集有關您使用的設備的訊息，包括操作系統、瀏覽器類型、IP地址、設備標識符等。
          </li>
        </ul>

        <h3>1.2 訊息的使用</h3>
        <p>我們使用收集的訊息來：</p>
        <ul>
          <li>提供、維護和改進 Ziphus；</li>
          <li>開發新的功能和服務；</li>
          <li>個性化用戶體驗；</li>
          <li>進行通信，包括提供客戶支持和發送關於 Ziphus 的更新和活動；</li>
          <li>增強安全性，包括檢測和預防欺詐。</li>
        </ul>

        <h2>2. 訊息的共享和披露</h2>
        <h3>2.1 共享政策</h3>
        <p>
          我們不會將您的個人訊息出售給第三方。我們僅在以下情況下共享您的訊息：
        </p>
        <ul>
          <li>
            <strong>服務提供者：</strong>我們可能會與協助我們運營 Ziphus
            的第三方服務提供者共享訊息，包括雲存儲、分析和客戶服務提供商。
          </li>
          <li>
            <strong>法律要求：</strong>
            如果法律要求，或出於誠信的目的相信分享是必要的，以符合任何適用的法律、法規，或符合法律程序或可執行的政府要求，我們可能會共享您的訊息。
          </li>
          <li>
            <strong>合併、收購或資產銷售：</strong>如果 Ziphus
            參與合併、收購或資產銷售，我們可能會將您的訊息轉讓給另一個實體，但將通過本隱私政策繼續保護該等訊息。
          </li>
        </ul>

        <h2>3. 訊息的安全</h2>
        <p>
          我們採取合理的安全措施來保護您的個人訊息免遭未經授權的訪問、披露、更改或破壞。這包括使用加密技術來保護敏感訊息。
        </p>

        <h2>4. 用戶權利</h2>
        <p>
          您有權訪問、更正、刪除您的個人訊息，以及限制或反對某些訊息的處理。您可以通過我們的用戶支持渠道聯繫我們來行使這些權利。
        </p>

        <h2>5. 變更</h2>
        <p>
          我們可能會不時更新本隱私政策。我們將通過在 Ziphus
          上發布更新後的政策並更新“更新日期”來通知您這些變更。
        </p>

        <h2>6. 聯繫我們</h2>
        <p>
          如果您對本隱私政策有任何疑問或疑慮，請通過
          <Link
            href="https://discord.gg/sDcyDYjr"
            className="text-blue-500 opacity-80 transition-opacity hover:opacity-100"
          >
            Discord
          </Link>
          與我們聯繫。
        </p>
      </main>
      <Footer />
    </div>
  );
}
