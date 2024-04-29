import Header from "@/components/header";
import { SpaceCreateButton } from "@/components/space/space-create-button";
import SpacePreviewList from "@/components/space/space-preview-list";

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-[#0E0E0E]">
      <Header />
      <main className=" container mx-auto py-4">
        <SpaceCreateButton className="mb-4" color="default">
          Create Space
        </SpaceCreateButton>
        <SpacePreviewList />
      </main>
    </div>
  );
}
