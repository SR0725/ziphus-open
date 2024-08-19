import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { DraggingLinkData, LinkDotDirection } from "@/models/dragging-link-data";
import useEditorStore from "@/stores/useEditorStore";
import useSpaceStore from "@/stores/useSpaceStore";
import delay from "@/utils/delay";


/**
 * 建立連結點的拖曳事件，並處理拖曳時 editor store 的狀態
 */
const useDragLinkEventCase = ({
  spaceCardId,
  linkDotRef,
  direction,
  onDragStart,
  onDragMove,
  onDragEnd,
  onBeConnected,
}: {
  spaceCardId: string;
  linkDotRef: React.RefObject<HTMLDivElement>;
  direction: LinkDotDirection;
  onDragStart?: () => void;
  onDragMove?: (event: MouseEvent) => void;
  onDragEnd?: () => void;
  onBeConnected?: (draggingLinkData: DraggingLinkData) => void;
}) => {
  const { setDraggingLinkData } = useEditorStore(
    useShallow((state) => ({
      draggingLinkData: state.draggingLinkData,
      setDraggingLinkData: (draggingLinkData: DraggingLinkData) => {
        useEditorStore.setState({
          draggingLinkData,
        });
      },
    }))
  );

  useEffect(() => {
    const linkDotElement = linkDotRef.current;
    if (!linkDotElement) return;

    const handleDragStart = (event: MouseEvent) => {
      // 如果正在連結中，則不觸發拖曳事件
      const draggingLinkData = useEditorStore.getState().draggingLinkData;
      if (draggingLinkData.isLinking) {
        return;
      }
      // 設定拖曳連結的起始資料
      setDraggingLinkData({
        ...draggingLinkData,
        isLinking: true,
        fromSpaceCardId: spaceCardId,
        toSpaceCardId: "",
        fromSpaceCardDirection: direction,
      });
      onDragStart?.();
      // 阻止原生事件觸發或傳遞
      event.stopPropagation();
      event.preventDefault();
      // 設定拖曳移動事件的觸發
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    };

    const handleDragMove = (event: MouseEvent) => {
      onDragMove?.(event);
      event.stopPropagation();
      event.preventDefault();
    };

    const handleDragEnd = async (event: MouseEvent) => {
      const draggingLinkData = useEditorStore.getState().draggingLinkData;
      if (
        !draggingLinkData.isLinking ||
        draggingLinkData.fromSpaceCardId !== spaceCardId
      ) {
        return;
      }
      onDragEnd?.();
      // 阻止原生事件觸發或傳遞
      event.stopPropagation();
      event.preventDefault();
      // 清除拖曳連結的資料
      await delay(10);
      setDraggingLinkData({
        ...draggingLinkData,
        isLinking: false,
        fromSpaceCardId: "",
        toSpaceCardId: "",
      });
      // 移除拖曳移動事件的觸發
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    const handleBeConnected = async (event: MouseEvent) => {
      const draggingLinkData = useEditorStore.getState().draggingLinkData;
      const spaceCard = useSpaceStore
        .getState()
        .spaceCards.find((sc) => sc.id === spaceCardId);
      if (
        !spaceCard ||
        !draggingLinkData.isLinking ||
        draggingLinkData.fromSpaceCardId === spaceCardId
      ) {
        return;
      }
      onBeConnected?.({
        isFocusLinkDot: draggingLinkData.isFocusLinkDot,
        isLinking: false,
        fromSpaceCardId: draggingLinkData.fromSpaceCardId,
        toSpaceCardId: spaceCardId,
        fromSpaceCardDirection: draggingLinkData.fromSpaceCardDirection,
        toSpaceCardDirection: direction,
      });
    };

    linkDotElement.addEventListener("mousedown", handleDragStart);
    linkDotElement.addEventListener("mouseup", handleBeConnected);

    return () => {
      linkDotElement.removeEventListener("mousedown", handleDragStart);
      linkDotElement.removeEventListener("mouseup", handleBeConnected);
    };
  }, []);
};

export default useDragLinkEventCase;