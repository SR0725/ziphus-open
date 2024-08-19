import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CardGetByIdResponseDTO } from "@repo/shared-types";
import { IndependentCardEditor } from "@/components/card/card-editor";
import CardHeaderBar from "@/components/card/card-header-bar";
import Sidebar from "@/components/sidebar";
import { fetchCardById } from "@/hooks/card/useQueryCardById";
import axiosInstance from "@/utils/axios";

export const metadata: Metadata = {};

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const cookieStore = cookies();
  const authorization = cookieStore.get("authorization");
  axiosInstance.defaults.headers.authorization = authorization?.value ?? "";

  let data: CardGetByIdResponseDTO | null = null;
  try {
    data = (await fetchCardById(id)).data;
  } catch (error) {
    console.error(error);
    redirect("/login");
  }

  const title = data?.card?.title ?? "Ziphus Card Editor";
  const description = data?.card?.snapshotContent.substring(0, 157) ?? "Ziphus";

  metadata.title = `${title} | Ziphus`;
  metadata.description = description;

  metadata.openGraph = {
    title,
    description,
    type: "website",
    url: `https://ziphus.com/space/${id}`,
  };

  metadata.twitter = {
    card: "summary",
    site: "@ziphus",
    title,
    description,
  };

  if (!data?.card) {
    return <div>Card not found</div>;
  }

  return (
    <div className="min-w-screen flex h-full min-h-screen w-full overflow-hidden bg-[#0E0E0E]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <CardHeaderBar />
        <main className="container mx-auto flex-1 p-4">
          <IndependentCardEditor initialCard={data.card} cardId={id} />
        </main>
      </div>
    </div>
  );
}
