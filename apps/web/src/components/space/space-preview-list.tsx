"use client";

import useQuerySpaceList from "@/hooks/space/useQuerySpaceList";
import SpacePreviewCard from "./space-preview-card";

function SpacePreviewList() {
  const { spaces } = useQuerySpaceList();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <SpacePreviewCard key={space.id} space={space} />
      ))}
    </div>
  );
}

export default SpacePreviewList;
