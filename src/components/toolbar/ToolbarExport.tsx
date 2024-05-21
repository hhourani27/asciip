import { IconButton, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportDialog } from "../dialogs/ExportDialog";

export function ToolbarExport(): JSX.Element {
  const dispatch = useAppDispatch();

  const shapesCount = useAppSelector((state) => state.diagram.shapes.length);

  const exportInProgress = useAppSelector(
    (state) => state.diagram.exportInProgress
  );

  return (
    <>
      <Tooltip title="Export diagram" arrow>
        <span>
          <IconButton
            onClick={() => dispatch(diagramActions.openExport())}
            aria-label="Export diagram"
            disabled={shapesCount === 0}
          >
            <FileDownloadIcon />
          </IconButton>
        </span>
      </Tooltip>
      {exportInProgress && <ExportDialog />}
    </>
  );
}
