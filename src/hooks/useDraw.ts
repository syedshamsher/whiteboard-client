import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void,
  onMouseMove: ({ clientX, clientY }: Positions) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinates>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const current = canvasRef.current;
    const handler = (e: MouseEvent) => {
      onMouseMove({ clientX: e.clientX, clientY: e.clientY });
      if (!mouseDown) return;
      const currentPoint = computePointInCanvas(e);

      const ctx = current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onDraw({ prevPoint: prevPoint.current, currentPoint, ctx });
      prevPoint.current = currentPoint;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    // Add event listeners
    current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    // Remove event listeners
    return () => {
      current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw, mouseDown, onMouseMove]);

  return { canvasRef, onMouseDown, clear, mousePosition, setMousePosition };
};
