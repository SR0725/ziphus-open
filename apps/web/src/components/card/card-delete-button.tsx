"use client";

import { useState } from "react";
import {
  Button,
  ButtonProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/nextui";
import useDeleteCard from "@/hooks/card/useDeleteCard";

interface CardDeleteButtonProps extends ButtonProps {
  cardId: string;
}
export function CardDeleteButton({
  children,
  cardId,
  ...props
}: CardDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mutate = useDeleteCard(cardId);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Popover
        placement="bottom"
        showArrow={true}
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <PopoverTrigger>
          <Button {...props}>{children || "Delete"}</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2 text-white">
            <div className="text-base font-bold">確定永久性刪除此卡片嗎？</div>
            <div className="text-small">
              這將同時刪除所有空間中的此卡片的分身
            </div>
            <div className="text-small">此項操作不可逆轉</div>
            <div className="mt-2 flex justify-end">
              <Button
                variant="light"
                onClick={() => setIsOpen(false)}
                className="mr-2"
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  mutate.mutate();
                  setIsOpen(false);
                }}
                color="danger"
              >
                刪除
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
