"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  SpaceGetWithAllResponseDTO,
  SpacePermissionDTO,
} from "@repo/shared-types";
import { cn } from "@/utils/cn";

/**
 * SpacePreviewCardContainer is a container component that wraps the card preview card to provide a 3D hover effect.
 */
function SpacePreviewCardContainer({
  children,
  className,
  available = true,
}: {
  children: React.ReactNode;
  className?: string;
  available?: boolean;
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
        "relative h-fit w-full overflow-hidden border border-solid border-white",
        !isHovering && " shadow transition-all duration-500 lg:shadow-2xl",
        fadingIn && " shadow transition-all duration-150 lg:shadow-2xl",
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
      onMouseMove={(e) => available && handleMouseMove(e)}
      onMouseEnter={() => {
        if (!available) {
          return;
        }
        setIsHovering(true);
        setFadingIn(true);
      }}
      onMouseLeave={() => available && setIsHovering(false)}
    >
      <div
        className="absolute left-1/2 top-1/2 -z-10 hidden h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#d4d5d6] backdrop-blur-sm transition-opacity duration-300 dark:bg-[#f74f4f] lg:block"
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

interface SpacePreviewCardProps {
  space: SpaceGetWithAllResponseDTO["spaces"][0];
}
function SpacePreviewCard({ space }: SpacePreviewCardProps) {
  const permissionText =
    space.permission === SpacePermissionDTO.Private
      ? "私人空間"
      : space.permission === SpacePermissionDTO.PublicReadOnly
        ? "公開空間（唯讀）"
        : "公開空間（可編輯）";

  const title =
    space.title.length === 0
      ? "無名空間"
      : space.title.length > 24
        ? space.title.slice(0, 24) + "..."
        : space.title;
  const isMobile = window.innerWidth < 768 ? "true" : "false";

  return (
    <Link href={`/space/${space.id}?isMobile=${isMobile}`} passHref>
      <SpacePreviewCardContainer className="rounded-lg">
        <div className="relative h-48 w-full max-w-2xl cursor-pointer overflow-hidden bg-[#5a5a5a33] p-6 lg:h-64 lg:backdrop-blur-3xl">
          <h2 className=" text-sm font-semibold text-[#5C5C5C] lg:text-lg">
            {permissionText} →
          </h2>
          <h1 className="text-lg font-bold text-[#A1A1A1] lg:text-2xl">
            {title}
          </h1>
        </div>
      </SpacePreviewCardContainer>
    </Link>
  );
}

export default SpacePreviewCard;
