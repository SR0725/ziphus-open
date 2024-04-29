import { CardCreateButton } from "@/components/card/card-create-button";
import CardPreviewList from "@/components/card/card-preview-list";
import Header from "@/components/header";

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-[#0E0E0E]">
      <Header />
      <main className=" container mx-auto py-4">
        <CardCreateButton className="mb-4" color="default">
          Create Card
        </CardCreateButton>
        <CardPreviewList />
      </main>
    </div>
  );
}
