import { useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useRef } from "react";
import { Coords } from "../../models/shapes";
import { appActions, appSelectors } from "../../store/appSlice";
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  drawGrid,
  drawHoveredCell,
  drawSelectedShape,
  drawShapes,
} from "./draw";
import _ from "lodash";
import { TextShapeInput } from "./TextShapeInput";

export default function Canvas(): JSX.Element {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  // This ref is used to prevent firing unnecessary cell hover events if the hovered cell didn't change.
  const hoveredCellRef = useRef<Coords | null>(null);

  const rowCount = useAppSelector((state) => state.app.canvasSize.rows);
  const colCount = useAppSelector((state) => state.app.canvasSize.cols);
  const canvasWidth = colCount * CELL_WIDTH;
  const canvasHeight = rowCount * CELL_HEIGHT;

  const currentHoveredCell = useAppSelector(
    (state) => state.app.currentHoveredCell
  );

  const shapes = useAppSelector((state) => state.app.shapes);
  const selectedShapeObj = useAppSelector((state) =>
    appSelectors.selectedShapeObj(state)
  );
  const newShape = useAppSelector((state) => state.app.creationProgress?.shape);
  const currentEditedText = useAppSelector((state) =>
    appSelectors.currentEditedText(state)
  );
  const nextActionOnClick = useAppSelector(
    (state) => state.app.nextActionOnClick
  );

  const getCellCoords = (eventX: number, eventY: number): Coords => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = eventX - rect.left;
    const y = eventY - rect.top;

    return { r: Math.floor(y / CELL_HEIGHT), c: Math.floor(x / CELL_WIDTH) };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext("2d")!;

    // Set canvas dimension
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the cursor
    canvas.style.cursor =
      nextActionOnClick === "SELECT"
        ? "pointer"
        : nextActionOnClick === "MOVE"
        ? "move"
        : nextActionOnClick === "RESIZE"
        ? "grabbing"
        : nextActionOnClick === "CREATE"
        ? "copy"
        : "default";

    // Draw the grid
    drawGrid(
      ctx,
      canvasWidth,
      canvasHeight,
      rowCount,
      colCount,
      theme.palette.grey["200"]
    );

    // Draw hovered cell
    if (currentHoveredCell && nextActionOnClick === "CREATE") {
      drawHoveredCell(ctx, currentHoveredCell);
    }

    // Draw shapes

    // Draw unselected shapes
    const unselectedShapes = shapes
      .filter((shape) => shape.id !== selectedShapeObj?.id)
      .map((obj) => obj.shape);
    drawShapes(ctx, unselectedShapes, "black");

    // Draw selected shape
    if (selectedShapeObj) drawSelectedShape(ctx, selectedShapeObj.shape);

    // Draw new shape
    if (newShape) drawShapes(ctx, [newShape], "DodgerBlue");
  }, [
    canvasHeight,
    canvasWidth,
    colCount,
    currentHoveredCell,
    newShape,
    nextActionOnClick,
    rowCount,
    selectedShapeObj,
    shapes,
    theme.palette.grey,
  ]);

  return (
    <div
      style={{
        flex: 1,
        overflow: "scroll",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={(e) =>
          dispatch(
            appActions.onCellMouseDown(getCellCoords(e.clientX, e.clientY))
          )
        }
        onMouseUp={(e) =>
          dispatch(
            appActions.onCellMouseUp(getCellCoords(e.clientX, e.clientY))
          )
        }
        onMouseMove={(e) => {
          const newCoords = getCellCoords(e.clientX, e.clientY);
          if (!_.isEqual(hoveredCellRef.current, newCoords)) {
            hoveredCellRef.current = newCoords;
            dispatch(
              appActions.onCellHover(getCellCoords(e.clientX, e.clientY))
            );
          }
        }}
        onMouseLeave={(e) => {
          dispatch(appActions.onCanvasMouseLeave());
        }}
        onClick={(e) =>
          dispatch(appActions.onCellClick(getCellCoords(e.clientX, e.clientY)))
        }
        onDoubleClick={(e) =>
          dispatch(
            appActions.onCellDoubleClick(getCellCoords(e.clientX, e.clientY))
          )
        }
      ></canvas>
      {currentEditedText && (
        <TextShapeInput
          // Add key, in order to force React to recreate a new instance when edit a new text object
          key={`textinput_r${currentEditedText.start.r}_c${currentEditedText.start.c}`}
        />
      )}
    </div>
  );
}
