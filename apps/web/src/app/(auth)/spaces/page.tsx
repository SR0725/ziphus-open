import { SpaceCreateButton } from "@/components/space/space-create-button";
import SpaceListHeader from "@/components/space/space-list-header";
import SpacePreviewList from "@/components/space/space-preview-list";

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-white dark:bg-[#0E0E0E]">
      <SpaceListHeader />
      <main className=" container mx-auto px-2 pb-16 pt-4 lg:px-8 lg:pt-12">
        <h2 className=" flex items-center gap-4 px-4 py-4 text-xl font-bold text-[#0E0E0E] dark:text-white lg:px-0 lg:py-2 sticky w-full backdrop-blur-md z-10 top-0">
          我的卡片庫
          {/** 電腦版新增卡片 */}
          <div className="hidden lg:block">
            <SpaceCreateButton className="text-sm" color="default">
              Create Space
            </SpaceCreateButton>
          </div>
        </h2>
        <SpacePreviewList />
        {/** 手機版新增卡片 */}
        <div className=" fixed bottom-0 z-10 flex h-fit w-screen items-center justify-center border-t bg-white py-4 dark:bg-[#0E0E0E] lg:hidden">
          <SpaceCreateButton className="px-6 py-0 text-2xl" color="default">
            +
          </SpaceCreateButton>
        </div>
      </main>
    </div>
  );
}
