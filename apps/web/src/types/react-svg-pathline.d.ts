declare module "react-svg-pathline" {
  interface Point {
    x: number;
    y: number;
  }

  interface PathLineProps {
    points: Point[];
    stroke?: string;
    strokeWidth?: string | number;
    fill?: string;
    r?: number;
    otherProps?: any;
  }

  export class PathLine extends React.Component<PathLineProps> {}
}
