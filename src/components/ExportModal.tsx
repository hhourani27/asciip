import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { appActions } from "../store/appSlice";
import { FONT_FAMILY } from "./canvas/draw";
import { getTextExport } from "../models/representation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export function ExportModal() {
  const dispatch = useAppDispatch();
  const exportInProgress = useAppSelector(
    (state) => state.app.exportInProgress
  );

  const shapeObjs = useAppSelector((state) => state.app.shapes);
  const styleMode = useAppSelector((state) => state.app.styleMode);
  const globalStyle = useAppSelector((state) => state.app.globalStyle);

  const canvasSize = useAppSelector((state) => state.app.canvasSize);

  const exportText = getTextExport(canvasSize, shapeObjs, {
    styleMode,
    globalStyle,
  });

  const copyDiagramToClipboard = async () => {
    await navigator.clipboard.writeText(exportText);
  };

  return (
    <Dialog
      open={exportInProgress}
      onClose={() => dispatch(appActions.closeExport())}
      maxWidth="lg"
    >
      <DialogTitle>Export diagram</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            fontFamily: FONT_FAMILY,
            fontSize: "12px",
            lineHeight: 1.25,
            maxWidth: "50vw",
            maxHeight: "50vh",
            overflow: "auto",
            whiteSpace: "pre",
          }}
        >
          {exportText}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={copyDiagramToClipboard}
          startIcon={<ContentCopyIcon />}
        >
          Copy diagram
        </Button>
      </DialogActions>
    </Dialog>
  );
}
