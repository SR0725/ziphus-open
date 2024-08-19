"use client";

import { FaRegEdit } from "react-icons/fa";
import { MdOutlineHeadset } from "react-icons/md";
import { PiStarFourBold } from "react-icons/pi";
import { toast } from "sonner";
import { Button } from "@/components/nextui";
import useMobileInfiniteScrollMode from "@/hooks/space/useMobileInfiniteScrollMode";
import useMobileIsEditing from "@/hooks/space/useMobileIsEditing";

function MobileSpaceFooterBar() {
  const { isEditing, toggleIsEditing } = useMobileIsEditing();
  const { isInfiniteScrollMode } = useMobileInfiniteScrollMode();
  if (isEditing || isInfiniteScrollMode) return null;
  return (
    <div className="fixed bottom-0 left-0 flex h-20 w-screen items-center justify-between">
      <Button
        className="h-full flex-grow text-4xl"
        variant="light"
        onClick={() => toast("功能尚未開放")}
      >
        <PiStarFourBold />
      </Button>
      <Button
        className="h-full flex-grow text-4xl"
        variant="light"
        onClick={() => toast("功能尚未開放")}
      >
        <FaRegEdit />
      </Button>
      <Button
        className="h-full flex-grow text-4xl"
        variant="light"
        onClick={() => toast("功能尚未開放")}
      >
        <MdOutlineHeadset />
      </Button>
    </div>
  );
}

export default MobileSpaceFooterBar;
