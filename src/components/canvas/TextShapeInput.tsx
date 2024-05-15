import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { diagramActions, diagramSelectors } from "../../store/diagramSlice";
import { CELL_HEIGHT, FONT_SIZE } from "./draw";
import { getStringFromShape } from "../../models/text";
import { ChangeEvent } from "react";

export function TextShapeInput(): JSX.Element {
  const dispatch = useAppDispatch();

  const currentEditedText = useAppSelector((state) =>
    diagramSelectors.currentEditedText(state)
  )!;

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(diagramActions.updateText(event.target.value));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: "10px",
        bottom: "20px",
      }}
    >
      <textarea
        style={{
          font: `${FONT_SIZE}px Courier New`,
          lineHeight: `${CELL_HEIGHT}px`,
          resize: "none",
        }}
        autoFocus
        wrap="off"
        rows={5}
        cols={20}
        value={getStringFromShape(currentEditedText)}
        onChange={handleTextChange}
      />
    </Box>
  );
}
