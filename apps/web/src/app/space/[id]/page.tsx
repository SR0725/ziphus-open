import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import SpaceEditor from "@/components/space/space-editor";
import SpaceHeaderBar from "@/components/space/space-header-bar";
import {
  fetchSpaceByIdWithFullData,
  SpaceWithFullData,
} from "@/hooks/space/useQuerySpaceWithFullData";
import axiosInstance from "@/utils/axios";

export const metadata: Metadata = {};

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    isMobile: string;
  };
}): Promise<JSX.Element> {
  const cookieStore = cookies();
  const authorization = cookieStore.get("authorization");
  axiosInstance.defaults.headers.authorization = authorization?.value ?? "";

  let data: SpaceWithFullData | null = null;
  try {
    data = await fetchSpaceByIdWithFullData(id);
  } catch (error) {
    console.error(error);
    redirect("/login");
  }

  const title = `${data?.title} | Ziphus` ?? "Space Editor | Ziphus";
  const description =
    data?.spaceCards
      .map((spaceCard) => spaceCard.card?.content ?? "")
      .join("")
      .substring(0, 157) ?? "Ziphus";

  metadata.title = `Ziphus - ${title}`;
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

  if (!data) {
    return <div>Space not found</div>;
  }
  return (
    <div className="min-w-screen flex h-full min-h-screen w-full overflow-hidden bg-[#0E0E0E]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <SpaceHeaderBar />
        <main className="h-full w-full">
          <SpaceEditor initialSpace={data} />
        </main>
      </div>
    </div>
  );
}
