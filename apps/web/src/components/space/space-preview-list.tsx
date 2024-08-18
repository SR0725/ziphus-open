"use client";

import useQuerySpaceList from "@/hooks/space/useQuerySpaceList";
import SpacePreviewCard from "./space-preview-card";

function SpacePreviewList() {
  const { spaces } = useQuerySpaceList();
  if (spaces.length === 0) {
    return (
      <div className=" p-4 text-lg font-bold text-gray-500">
        這裡空空如也，沒有任何一份筆記
        <div className="block lg:hidden">
          點擊下方
          <span className="mx-2 rounded-full bg-gray-500 px-4 text-sm text-white">
            +
          </span>
          按鈕來新增一份筆記吧！
        </div>
        <div className="hidden lg:block">
          點擊上方
          <span className="mx-2 rounded-full bg-gray-500 px-4 text-sm text-white">
            Create Space
          </span>
          按鈕來新增一份筆記吧！
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <SpacePreviewCard key={space.id} space={space} />
      ))}
    </div>
  );
}

export default SpacePreviewList;
