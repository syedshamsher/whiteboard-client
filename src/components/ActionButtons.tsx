import React, { memo } from "react";
import styles from "../app/CollaborativeBoard.module.css";

type Props = {
  onClearCanvasClick: () => void;
  onSaveCanvasClick: () => void;
};

const Component: React.FC<Props> = (props) => {
  const { onClearCanvasClick, onSaveCanvasClick } = props;
  return (
    <div className={`${styles.option}  ${styles.buttons}`}>
      <button
        className={styles.clearCanvas}
        onClick={() => onClearCanvasClick()}
      >
        Clear Canvas
      </button>
      <button className={styles.saveImg} onClick={() => onSaveCanvasClick()}>
        Save As Image
      </button>
    </div>
  );
};

export const ActionButton = memo(Component);
