import { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/footer";
import Header from "@/components/header";
import "./style.css";

export const metadata: Metadata = {
  title: "Terms | Ziphus",
};

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-black ">
      <Header />
      <main className="container mx-auto mb-96 flex flex-col items-start py-4 text-white">
        <h1>Ziphus 服務條款</h1>
        <p>
          歡迎使用Ziphus！Ziphus是一款旨在提供無限創作空間和結構化筆記功能的創新筆記軟體，結合了視覺布局的自由度和結構化內容的優雅，為您的思維導圖和筆記創作提供了全新的平台。
        </p>

        <h2>1. 接受條款</h2>
        <p>
          通過訪問和/或使用Ziphus，您同意受本服務條款、我們的隱私政策以及所有適用法律和規定的約束。如果您不同意本條款中的任何條款，您可能無法使用Ziphus服務。
        </p>

        <h2>2. 服務描述</h2>
        <p>
          Ziphus提供一個無邊界的創作平台，允許用戶自由地建立和編排筆記、繪製思維導圖和視覺布局。您可以利用空間來分類筆記、建立群組和建立筆記間的連結，並在每份筆記中直接畫圖、標注重點或書寫文字。
        </p>

        <h2>3. 使用者義務</h2>
        <ul>
          <li>
            <strong>內容責任</strong>
            ：您對於透過Ziphus發布、傳遞、存儲的所有內容負責，包括但不限於文字、圖片和視頻資料。
          </li>
          <li>
            <strong>合法使用</strong>
            ：您同意不會使用Ziphus進行任何非法目的，或以任何非法方式使用我們的服務。
          </li>
          <li>
            <strong>尊重他人權利</strong>
            ：您不得上傳、發布任何侵犯他人版權、商標或其他智慧財產權的內容。
          </li>
        </ul>

        <h2>4. 服務變更和終止</h2>
        <p>
          Ziphus保留隨時修改或終止服務（或其任何部分）的權利，無需事先通知。Ziphus對您或任何第三方對任何修改、價格變動、暫停或中斷服務不承擔責任。
        </p>

        <h2>5. 免責聲明</h2>
        <p>
          Ziphus服務和其所有內容、功能提供基於"現狀"，不提供任何形式的明示或暗示保證。
        </p>

        <h2>6. 隱私政策</h2>
        <p>
          您的隱私對我們至關重要。Ziphus的隱私政策解釋了我們如何收集、使用和保護您的個人信息。使用Ziphus服務即表示您同意該隱私政策的條款。
        </p>

        <h2>7. 著作權政策</h2>
        <p>
          Ziphus尊重他人的知識產權，並期望我們的用戶也做到這一點。我們有政策和程序以處理侵犯著作權的指控。
        </p>

        <h2>8. 修改服務條款</h2>
        <p>
          Ziphus保留隨時修改本服務條款的權利。我們將會在網站上發布修訂後的條款。使用Ziphus服務繼續進行時，即表示您接受修改後的條款。
        </p>

        <h2>6. 聯繫我們</h2>
        <p>
          如有任何關於本服務條款的問題，請透過
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
