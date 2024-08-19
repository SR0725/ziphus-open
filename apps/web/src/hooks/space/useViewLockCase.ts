"use client";

import { useShallow } from "zustand/react/shallow";
import useEditorStore from "@/stores/useEditorStore";

const useViewLockCase = () => {
  const { isViewLocked, setIsViewLocked } = useEditorStore(
    useShallow((state) => ({
      isViewLocked: state.isViewLocked,
      setIsViewLocked: (isViewLocked: boolean) => {
        useEditorStore.setState({ isViewLocked });
      },
    }))
  );

  return { isViewLocked, setIsViewLocked };
};

export default useViewLockCase;
