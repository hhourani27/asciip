import { Box, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";
import { CELL_HEIGHT, FONT_SIZE } from "./draw";
import { getStringFromShape } from "../../models/text";
import { ChangeEvent } from "react";
import { selectors } from "../../store/selectors";

export function TextShapeInput(): JSX.Element {
  const dispatch = useAppDispatch();

  const currentEditedText = useAppSelector((state) =>
    selectors.currentEditedText(state.diagram)
  )!;

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(diagramActions.updateText(event.target.value));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: "10px",
        bottom: "70px",
      }}
    >
      <TextField
        id="text-shape-input"
        multiline
        variant="filled"
        color="secondary"
        autoFocus
        rows={5}
        value={getStringFromShape(currentEditedText)}
        onChange={handleTextChange}
        sx={{
          font: `${FONT_SIZE}px Courier New`,
          lineHeight: `${CELL_HEIGHT}px`,
          backgroundColor: "secondary",
          width: "300px",
        }}
        InputProps={{ sx: { pt: 1, pr: 0 } }}
      />
    </Box>
  );
}
