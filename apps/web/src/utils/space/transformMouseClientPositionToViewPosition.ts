import { View } from "@/models/view";

// 將滑鼠在編輯器上的相對位置轉換成實際位置
const transformMouseClientPositionToViewPosition = (
  view: View,
  clientX: number,
  clientY: number
) => {
  const newX = (clientX - view.x) / view.scale;
  const newY = (clientY - view.y) / view.scale;
  return {
    x: newX,
    y: newY,
  };
};

export default transformMouseClientPositionToViewPosition;
