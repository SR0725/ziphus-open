"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/nextui";
import SpaceHeaderBarRetitleInput from "./space-header-bar-retitle-input";

function SpaceHeaderBar() {
  return (
    <div className="flex h-8 items-center bg-[#0E0E0E] px-8 text-white">
      <Breadcrumbs size="sm">
        <BreadcrumbItem key="space-list" href="/spaces">
          空間列表
        </BreadcrumbItem>
        <BreadcrumbItem>
          <SpaceHeaderBarRetitleInput />
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}

export default SpaceHeaderBar;
