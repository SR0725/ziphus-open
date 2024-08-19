import { LinkDotDirection } from "@/models/dragging-link-data";

// 輸入空間卡片位置與卡片大小，並給予連結點位置，回傳連結點座標
function getSpaceCardLinkDotPosition(
  { x, y }: { x: number; y: number },
  { width, height }: { width: number; height: number },
  direction: LinkDotDirection
) {
  switch (direction) {
    case "top":
      return { x: x + width / 2, y };
    case "right":
      return { x: x + width, y: y + height / 2 };
    case "bottom":
      return { x: x + width / 2, y: y + height };
    case "left":
      return { x, y: y + height / 2 };
    default:
      return { x: 0, y: 0 };
  }
}

export default getSpaceCardLinkDotPosition;
