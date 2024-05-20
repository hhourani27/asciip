import { useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useRef } from "react";
import { Coords } from "../../models/shapes";
import { diagramActions, diagramSelectors } from "../../store/diagramSlice";
import { CELL_HEIGHT, CELL_WIDTH, canvasDraw } from "./draw";
import _ from "lodash";
import { TextShapeInput } from "./TextShapeInput";
import { getPointer } from "../../store/uiSelectors";

export default function Canvas(): JSX.Element {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  // This ref is used to prevent firing unnecessary cell hover events if the hovered cell didn't change.
  const hoveredCellRef = useRef<Coords | null>(null);

  const rowCount = useAppSelector((state) => state.diagram.canvasSize.rows);
  const colCount = useAppSelector((state) => state.diagram.canvasSize.cols);
  const canvasWidth = colCount * CELL_WIDTH;
  const canvasHeight = rowCount * CELL_HEIGHT;

  const currentHoveredCell = useAppSelector(
    (state) => state.diagram.currentHoveredCell
  );

  const styleMode = useAppSelector((state) => state.diagram.styleMode);
  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const shapes = useAppSelector((state) => state.diagram.shapes);
  const selectedShapeObj = useAppSelector((state) =>
    diagramSelectors.selectedShapeObj(state)
  );
  const newShape = useAppSelector((state) =>
    diagramSelectors.currentCreatedShape(state)
  );
  const currentEditedText = useAppSelector((state) =>
    diagramSelectors.currentEditedText(state)
  );

  const nextActionOnClick = useAppSelector((state) => getPointer(state));

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
    canvasDraw.setBackground(
      ctx,
      canvas.width,
      canvas.height,
      theme.canvas.background
    );

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
    canvasDraw.drawGrid(
      ctx,
      canvasWidth,
      canvasHeight,
      rowCount,
      colCount,
      theme.canvas.grid
    );

    // Draw hovered cell
    if (currentHoveredCell && nextActionOnClick === "CREATE") {
      canvasDraw.drawHoveredCell(ctx, currentHoveredCell);
    }

    // Draw shapes

    // Draw unselected shapes
    const unselectedShapes = shapes.filter(
      (shape) => shape.id !== selectedShapeObj?.id
    );
    canvasDraw.drawShapes(
      ctx,
      unselectedShapes,
      styleMode,
      globalStyle,
      theme.canvas.shape
    );

    // Draw selected shape
    if (selectedShapeObj)
      canvasDraw.drawSelectedShape(
        ctx,
        selectedShapeObj,
        styleMode,
        globalStyle,
        theme.canvas.selectedShape
      );

    // Draw new shape
    if (newShape)
      canvasDraw.drawShapes(
        ctx,
        [newShape],
        styleMode,
        globalStyle,
        theme.canvas.createdShape
      );
  }, [
    canvasHeight,
    canvasWidth,
    colCount,
    currentHoveredCell,
    globalStyle,
    newShape,
    nextActionOnClick,
    rowCount,
    selectedShapeObj,
    shapes,
    styleMode,
    theme.canvas.background,
    theme.canvas.createdShape,
    theme.canvas.grid,
    theme.canvas.selectedShape,
    theme.canvas.shape,
  ]);

  return (
    <div
      style={{
        flex: 1,
        overflow: "scroll",
        position: "relative",
        scrollbarColor: `${theme.palette.primary.light} ${theme.palette.primary.main}`,
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={(e) =>
          dispatch(
            diagramActions.onCellMouseDown(getCellCoords(e.clientX, e.clientY))
          )
        }
        onMouseUp={(e) =>
          dispatch(
            diagramActions.onCellMouseUp(getCellCoords(e.clientX, e.clientY))
          )
        }
        onMouseMove={(e) => {
          const newCoords = getCellCoords(e.clientX, e.clientY);
          if (!_.isEqual(hoveredCellRef.current, newCoords)) {
            hoveredCellRef.current = newCoords;
            dispatch(
              diagramActions.onCellHover(getCellCoords(e.clientX, e.clientY))
            );
          }
        }}
        onMouseLeave={(e) => {
          dispatch(diagramActions.onCanvasMouseLeave());
        }}
        onClick={(e) =>
          dispatch(
            diagramActions.onCellClick(getCellCoords(e.clientX, e.clientY))
          )
        }
        onDoubleClick={(e) =>
          dispatch(
            diagramActions.onCellDoubleClick(
              getCellCoords(e.clientX, e.clientY)
            )
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
