import React, { memo } from "react";
import BrushIcon from "../icons/brush.svg";
import EraserIcon from "../icons/eraser.svg";
import styles from "../app/CollaborativeBoard.module.css";

type Props = {
  tool: string;
  brushWidth: number;
  handleToolChange: (tool: string) => void;
  handleBrushSizeChange: (size: number) => void;
};

const Component: React.FC<Props> = (props) => {
  const { tool, brushWidth, handleToolChange, handleBrushSizeChange } = props;
  return (
    <div className={styles.row}>
      <label className={styles.title}>Options</label>
      <ul className={styles.options}>
        <li
          className={`${styles.option} ${
            tool === "brush" ? styles.active : ""
          }`}
          id={styles.brush}
          key={"brush"}
          onClick={() => handleToolChange("brush")}
        >
          <img src={BrushIcon} alt="brush" />
          <span>Brush</span>
        </li>
        <li
          className={`${styles.option} ${
            tool === "eraser" ? styles.active : ""
          }`}
          id={styles.eraser}
          key={"eraser"}
          onClick={() => handleToolChange("eraser")}
        >
          <img src={EraserIcon} alt="eraser" />
          <span>Eraser</span>
        </li>
        <li className={styles.option} key={"range"}>
          <input
            type="range"
            id={styles.sizeSlider}
            min="1"
            max="30"
            value={brushWidth}
            onChange={(e) => handleBrushSizeChange(Number(e.target.value))}
          />
        </li>
      </ul>
    </div>
  );
};

export const DrawingOptions = memo(Component);
