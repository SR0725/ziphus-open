export type LinkDotDirection = "top" | "right" | "bottom" | "left";
export interface DraggingLinkData {
  isFocusLinkDot: boolean;
  isLinking: boolean;
  fromSpaceCardId: string;
  toSpaceCardId: string;
  fromSpaceCardDirection: LinkDotDirection;
  toSpaceCardDirection: LinkDotDirection;
}
