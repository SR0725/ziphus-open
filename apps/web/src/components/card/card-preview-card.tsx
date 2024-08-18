"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardGetWithAllResponseDTO,
  CardPermissionDTO,
} from "@repo/shared-types";
import { cn } from "@/utils/cn";
import { CardDeleteButton } from "./card-delete-button";

/**
 * CardPreviewCardContainer is a container component that wraps the card preview card to provide a 3D hover effect.
 */
function CardPreviewCardContainer({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [fadingIn, setFadingIn] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const { left, top } = cardRef.current.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    if (fadingIn) {
      const timer = setTimeout(() => {
        setFadingIn(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [fadingIn]);

  return (
    <div
      className={cn(
        "relative h-fit w-full overflow-hidden",
        !isHovering && "shadow-2xl transition-all duration-500",
        fadingIn && "shadow-2xl transition-all duration-150",
        className
      )}
      style={{
        transform: isHovering
          ? `perspective(1000px) rotateX(${
              (mousePosition.y - 150) / 10
            }deg) rotateY(${(150 - mousePosition.x) / 10}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovering(true);
        setFadingIn(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#4fc3f7] backdrop-blur-sm transition-opacity duration-300"
        style={{
          top: `${mousePosition.y}px`,
          left: `${mousePosition.x}px`,
          opacity: isHovering ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}

interface CardPreviewCardProps {
  card: CardGetWithAllResponseDTO["cards"][0];
}
function CardPreviewCard({ card }: CardPreviewCardProps) {
  const permissionText =
    card.permission === CardPermissionDTO.Private
      ? "私人筆記"
      : card.permission === CardPermissionDTO.PublicReadOnly
        ? "公開筆記（唯讀）"
        : "公開筆記（可編輯）";

  const title =
    card.title.length === 0
      ? "Untitled"
      : card.title.length > 24
        ? card.title.slice(0, 24) + "..."
        : card.title;

  const router = useRouter();

  return (
    <CardPreviewCardContainer
      className="rounded-lg"
      onClick={() => router.push(`/card/${card.id}`)}
    >
      <div className="relative h-64 w-full max-w-2xl cursor-pointer overflow-hidden bg-[#5a5a5a33] p-6 backdrop-blur-3xl">
        <div className=" flex items-start justify-between">
          <h2 className="text-lg font-semibold text-[#5C5C5C]">
            {permissionText} →
          </h2>
          <CardDeleteButton cardId={card.id}>刪除</CardDeleteButton>
        </div>
        <h1 className="text-2xl font-bold text-[#A1A1A1]">{title}</h1>
        <p
          className="mt-2 overflow-hidden text-[#919191]"
          dangerouslySetInnerHTML={{ __html: card.snapshotContent }}
        ></p>
      </div>
    </CardPreviewCardContainer>
  );
}

export default CardPreviewCard;
