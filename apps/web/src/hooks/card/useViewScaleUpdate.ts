"use client";

import { useCallback, useEffect, useState } from "react";
import { CardDto } from "@repo/shared-types";

// 隨時更新大小
const useViewScaleUpdate = (
  cardHTMLElementRef: React.RefObject<HTMLDivElement>,
  cardDataRef: React.MutableRefObject<CardDto>
) => {
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!cardHTMLElementRef.current) {
      return;
    }
    cardHTMLElementRef.current.style.width = `${cardDataRef.current.width}px`;
    cardHTMLElementRef.current.style.height = `${cardDataRef.current.height}px`;
  }, [refresh]);

  const needRefresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  useEffect(() => {
    needRefresh();
  }, []);

  return {
    needRefresh,
  };
};

export default useViewScaleUpdate;
