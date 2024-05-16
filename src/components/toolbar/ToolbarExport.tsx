import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportDialog } from "../dialogs/ExportDialog";

export function ToolbarExport(): JSX.Element {
  const dispatch = useAppDispatch();

  const exportInProgress = useAppSelector(
    (state) => state.diagram.exportInProgress
  );

  return (
    <>
      <IconButton
        onClick={() => dispatch(diagramActions.openExport())}
        aria-label="Export"
      >
        <FileDownloadIcon />
      </IconButton>
      {exportInProgress && <ExportDialog />}
    </>
  );
}
