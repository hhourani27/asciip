import { styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { appActions } from "../store/appSlice";

export type CanvasCellProps = {
  x: number;
  y: number;
};

const StyledCanvasCell = styled("div")(({ theme }) => ({
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: theme.palette.grey["200"],

  flexBasis: "10px",
  flexGrow: 0,
  flexShrink: 0,
  width: "10px",
  height: "10px",
}));

export function CanvasCell({ x, y }: CanvasCellProps): JSX.Element {
  const dispatch = useAppDispatch();

  const cellValue = useAppSelector((state) => state.app.gridRepr[x][y]);

  return (
    <StyledCanvasCell
      onMouseDown={() => dispatch(appActions.onCellMouseDown({ x, y }))}
      onMouseUp={() => dispatch(appActions.onCellMouseUp({ x, y }))}
      onMouseEnter={() => dispatch(appActions.onCellHover({ x, y }))}
    >
      {cellValue}
    </StyledCanvasCell>
  );
}
