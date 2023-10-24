import React, { memo } from "react";
import styles from "../app/CollaborativeBoard.module.css";

const defaultColors: DefaultColorsType[] = [
  "#ffffff",
  "#000000",
  "#e02020",
  "#6dd400",
];

type Props = {
  color: string;
  handleColorChange: (color: string) => void;
};

const Component: React.FC<Props> = (props) => {
  const { color, handleColorChange } = props;
  return (
    <div className={`${styles.row}  ${styles.colors}`}>
      <label className={styles.title}>Colors</label>
      <ul className={styles.options}>
        {defaultColors?.map((item) => (
          <li
            className={`${styles.option} ${
              item === color ? styles.selected : ""
            }`}
            key={item}
            onClick={() => handleColorChange(item as string)}
          ></li>
        ))}
        <li
          className={`${styles.option} ${
            !defaultColors?.includes(color as DefaultColorsType)
              ? styles.selected
              : ""
          }`}
          key={"color"}
        >
          <input
            type="color"
            id={styles.colorPicker}
            value={color}
            onChange={(e) => handleColorChange(e?.target?.value)}
          />
        </li>
      </ul>
    </div>
  );
};

export const Colors = memo(Component);
