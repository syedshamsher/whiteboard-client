import { memo, useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDraw } from "../hooks/useDraw";
import { drawLine } from "../utils/drawLine";
import { DrawingOptions } from "../components/DrawingOptions";
import { Colors } from "../components/Colors";
import { ActionButton } from "../components/ActionButtons";
import styles from "./CollaborativeBoard.module.css";

const socket = io("https://whiteboard-server.adaptable.app/");

type Positions = {
  clientX: number;
  clientY: number;
};

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  brushWidth: number;
};

const Component = () => {
  const [color, setColor] = useState<string>("#000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [tool, setTool] = useState<string>("brush");

  //#region [Subscription of the custom hook]
  const { canvasRef, onMouseDown, clear, mousePosition, setMousePosition } =
    useDraw(onDraw, onMouseMove);
  //#endregion [Subscription of the custom hook]

  //#region [Side Effects]

  useEffect(() => {
    const canvas = canvasRef.current;
    // setting whole canvas background to white on initial load with canvasRef, so that the downloaded img background will be white
    setCanvasBackground(canvas);
  }, [canvasRef]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("I received the state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color, brushWidth }: DrawLineProps) => {
        if (!ctx) return console.log("no ctx here");
        drawLine({ prevPoint, currentPoint, ctx, color, brushWidth });
      }
    );

    // Receive cursor positions from the server and update state
    socket.on("update-cursors", (positions) => {
      setMousePosition(positions);
    });

    socket.on("clear", clear);

    return () => {
      socket.off("draw-line");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("update-cursors");
      socket.off("update-cursor-position");
      socket.off("clear");
    };
  }, [canvasRef, clear, setMousePosition]);
  //#endregion [Side Effects]

  //#region [Handlers]
  function onDraw({ prevPoint, currentPoint, ctx }: Draw) {
    const selectedColor = tool === "eraser" ? "#fff" : color;
    socket.emit("draw-line", {
      prevPoint,
      currentPoint,
      ctx,
      color: selectedColor,
      brushWidth,
    });
    drawLine({
      prevPoint,
      currentPoint,
      ctx,
      color: selectedColor,
      brushWidth,
    });
  }

  // Send cursor position to the server when it changes
  function onMouseMove({ clientX, clientY }: Positions) {
    socket.emit("update-cursor-position", { x: clientX, y: clientY });
  }

  function setCanvasBackground(canvas: HTMLCanvasElement | null) {
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color; // setting fillstyle back to the selectedColor, it'll be the brush color
    }
  }

  // Render cursors based on mousePosition state
  const renderRealTimeUsers = useCallback(() => {
    if (mousePosition) {
      return Object.entries(mousePosition)
        ?.filter(([socketId]) => socketId !== socket.id)
        ?.map(([socketId, position]) => {
          return (
            <div
              key={socketId}
              className={styles.realTimeUser}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            >
              <span className={styles.cursor}></span>
              <span className={styles.user}>{socketId}</span>
            </div>
          );
        });
    }
  }, [mousePosition]);

  const handleToolChange = (tool: string) => {
    setTool(tool);
  };

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushWidth(size);
  };

  const onSaveClick = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas?.toDataURL("image/jpg") || "";
    link.click();
  };

  const onClearClick = () => {
    socket.emit("clear");
  };
  //#endregion [Handlers]

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.toolsContainer}>
        <section className={styles.toolsBoard}>
          <DrawingOptions
            tool={tool}
            brushWidth={brushWidth}
            handleToolChange={handleToolChange}
            handleBrushSizeChange={handleBrushSizeChange}
          />
          <Colors color={color} handleColorChange={handleColorChange} />
          <ActionButton
            onClearCanvasClick={onClearClick}
            onSaveCanvasClick={onSaveClick}
          />
        </section>
      </div>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={750}
          height={750}
          onMouseDown={onMouseDown}
          className={styles.canvas}
        />
      </div>
      {renderRealTimeUsers()}
    </div>
  );
};

export const CollaborativeBoard = memo(Component);
