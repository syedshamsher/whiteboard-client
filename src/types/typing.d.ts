type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Point = { x: number; y: number };

type Specification = {
  color: string;
  brushWidth: number;
};

type DrawLineProps = Draw & Specification;

type ShapesProps = Draw &
  Specification & {
    isFillColor: boolean;
    offsetX: number;
    offsetY: number;
  };

type Positions = {
  clientX: number;
  clientY: number;
};

type DefaultColorsType = "#ffffff" | "#000000" | "#e02020" | "#6dd400";

type Coordinates = {
  [key: string]: {
    x: number;
    y: number;
  };
};
