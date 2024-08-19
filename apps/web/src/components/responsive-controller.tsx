"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SpaceWithFullData } from "@/hooks/space/useQuerySpaceWithFullData";

function ResponsiveController() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, pathname]
  );

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSearchParams("isMobile", "true");
    } else {
      setSearchParams("isMobile", "false");
    }
  }, []);

  return null;
}

export default ResponsiveController;
