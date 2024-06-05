import { useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useRef } from "react";
import { Coords, normalizeTlBr } from "../../models/shapes";
import { diagramActions } from "../../store/diagramSlice";
import { CELL_HEIGHT, CELL_WIDTH, DrawOptions, canvasDraw } from "./draw";
import _ from "lodash";
import { TextShapeInput } from "./TextShapeInput";
import { selectors } from "../../store/selectors";

export default function Canvas(): JSX.Element {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  // This ref is used to prevent firing unnecessary cell hover events if the hovered cell didn't change.
  const hoveredCellRef = useRef<Coords | null>(null);
  // This ref is used to distinguish between a series of mouseup and down and a click.
  const pendingMouseDown = useRef<{
    timestamp: number;
    cell: Coords;
    timeoutId: number;
    pendingMoveActions: Coords[];
  } | null>(null);

  //#region selectors
  const rowCount = useAppSelector((state) => state.diagram.canvasSize.rows);
  const colCount = useAppSelector((state) => state.diagram.canvasSize.cols);
  const canvasWidth = colCount * CELL_WIDTH;
  const canvasHeight = rowCount * CELL_HEIGHT;

  const currentHoveredCell = useAppSelector(
    (state) => state.diagram.currentHoveredCell
  );

  const styleMode = useAppSelector((state) => state.diagram.styleMode);
  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const shapeObjs = useAppSelector((state) => state.diagram.shapes);
  const selectedShapeObjs = useAppSelector((state) =>
    selectors.selectedShapeObjs(state.diagram)
  );
  const newShape = useAppSelector((state) =>
    selectors.currentCreatedShape(state.diagram)
  );
  const currentEditedText = useAppSelector((state) =>
    selectors.currentEditedText(state.diagram)
  );

  const nextActionOnClick = useAppSelector((state) =>
    selectors.getPointer(state.diagram)
  );
  const mode = useAppSelector((state) => state.diagram.mode);

  // #endregion

  //#region helper functions
  const getCellCoords = (eventX: number, eventY: number): Coords => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = eventX - rect.left;
    const y = eventY - rect.top;

    return { r: Math.floor(y / CELL_HEIGHT), c: Math.floor(x / CELL_WIDTH) };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCellCoords(e.clientX, e.clientY);
    const timeoutId = window.setTimeout(() => {
      dispatch(diagramActions.onCellMouseDown(coords));
      if (pendingMouseDown.current) {
        pendingMouseDown.current.pendingMoveActions.forEach((m) =>
          dispatch(diagramActions.onCellHover(m))
        );
      }
      pendingMouseDown.current = null;
    }, 150);

    pendingMouseDown.current = {
      timestamp: e.timeStamp,
      cell: coords,
      timeoutId,
      pendingMoveActions: [],
    };
  };

  const handleMouseMove = (newCoords: Coords) => {
    if (pendingMouseDown.current) {
      const { pendingMoveActions } = pendingMouseDown.current;
      if (pendingMoveActions.length === 0) {
        if (!_.isEqual(hoveredCellRef.current, newCoords)) {
          pendingMoveActions.push(newCoords);
        }
      } else {
        if (!_.isEqual(_.last(pendingMoveActions), newCoords)) {
          pendingMouseDown.current.pendingMoveActions.push(newCoords);
        }
      }
    } else {
      hoveredCellRef.current = newCoords;
      dispatch(diagramActions.onCellHover(newCoords));
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const coords = getCellCoords(e.clientX, e.clientY);

    // If mousedown was not fired => mouse up came up very fast => dispatch a click
    if (pendingMouseDown.current) {
      window.clearTimeout(pendingMouseDown.current.timeoutId);
      pendingMouseDown.current.pendingMoveActions.forEach((m) =>
        dispatch(diagramActions.onCellHover(m))
      );
      dispatch(
        diagramActions.onCellClick({
          coords,
          ctrlKey: e.ctrlKey,
        })
      );
      pendingMouseDown.current = null;
    } else {
      // mousedown was already dispatched => Dispatch mouseup
      dispatch(diagramActions.onCellMouseUp(coords));
    }
  };

  //#endregion

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
    const selectedShapeIds = selectedShapeObjs.map((s) => s.id);

    const drawOpts: DrawOptions[] = shapeObjs.map((so) => {
      const isShapeSelected = selectedShapeIds.includes(so.id);
      const color = isShapeSelected
        ? theme.canvas.selectedShape
        : theme.canvas.shape;
      const drawResizePoints: boolean =
        isShapeSelected &&
        selectedShapeObjs.length === 1 &&
        mode.M !== "SELECT_DRAG";

      return { color, drawResizePoints };
    });

    canvasDraw.drawShapes(ctx, shapeObjs, styleMode, globalStyle, drawOpts);

    // Draw new shape
    if (newShape) {
      canvasDraw.drawShapes(ctx, [newShape], styleMode, globalStyle, [
        { color: theme.canvas.createdShape, drawResizePoints: false },
      ]);
    }

    // Draw select box if I'm drag-selecting
    if (mode.M === "SELECT_DRAG") {
      const [tl, br] = normalizeTlBr(mode.start, mode.curr);
      canvasDraw.drawSelectBox(ctx, tl, br, theme.canvas.selectBox);
    }
  }, [
    canvasHeight,
    canvasWidth,
    colCount,
    currentHoveredCell,
    globalStyle,
    mode,
    newShape,
    nextActionOnClick,
    rowCount,
    selectedShapeObjs,
    shapeObjs,
    styleMode,
    theme.canvas.background,
    theme.canvas.createdShape,
    theme.canvas.grid,
    theme.canvas.selectedShape,
    theme.canvas.shape,
    theme.canvas.selectBox,
  ]);

  return (
    <div
      id="canvas-container"
      style={{
        flex: 1,
        overflow: "scroll",
        position: "relative",
        scrollbarColor: `${theme.palette.primary.light} ${theme.palette.primary.main}`,
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={(e) =>
          handleMouseMove(getCellCoords(e.clientX, e.clientY))
        }
        onMouseLeave={(e) => {
          dispatch(diagramActions.onCanvasMouseLeave());
        }}
        onDoubleClick={(e) => {
          dispatch(
            diagramActions.onCellDoubleClick(
              getCellCoords(e.clientX, e.clientY)
            )
          );
        }}
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
