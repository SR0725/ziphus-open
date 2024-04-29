這是一個圖形繪製的元件，提供基本的繪圖功能，包含畫線、畫矩形、畫圓。
而且會注重效能，只會在有變動時才重新渲染。

## Usage
```tsx
import { useSketchCanvasProvider, SketchCanvas } from '@repo/sketch-canvas';

function App() {
    const provider = useSketchCanvasProvider();
    
    return <SketchCanvas provider={provider} />
}
```

### Function
`getShapes()` - 取得所有被渲染的圖型資料
`addShape(Shape)` - 新增圖型資料
`setShape(id, Shape)` - 設定圖型資料
`removeShape(id)` - 移除圖型資料
`clear()` - 清除所有圖型資料
`undo()` - 復原上一步
`redo()` - 重做上一步

### Props
`provider` - 必要，`useSketchCanvasProvider` 回傳的物件

### Types
```ts
enum ShapeType {
    Line = 'line',
    Rect = 'rect',
    Circle = 'circle',
}

interface Shape = {
    id: string;
    type: ShapeType;
    color: string;
}

interface Line extends Shape {
    type: ShapeType.Line;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

interface Rect extends Shape {
    type: ShapeType.Rect;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Circle extends Shape {
    type: ShapeType.Circle;
    x: number;
    y: number;
    size: number; // 直徑
}
```