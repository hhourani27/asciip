import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { appActions } from "../../store/appSlice";

export function DeleteDiagramConfirmationDialog(): JSX.Element {
  const dispatch = useAppDispatch();

  const deletedDiagramId: string = useAppSelector(
    (state) => state.app.deleteDiagramInProgress!
  );
  const deletedDiagramName: string = useAppSelector(
    (state) => state.app.diagrams.find((d) => d.id === deletedDiagramId)!.name
  );

  const confirmDelete = () => {
    dispatch(appActions.deleteDiagram(deletedDiagramId));
  };

  const cancelDelete = () => {
    dispatch(appActions.cancelDeleteDiagram());
  };

  return (
    <Dialog
      open
      onClose={cancelDelete}
      aria-labelledby="delete-confirmation-dialog"
    >
      <DialogTitle id="delete-confirmation-dialog-title">
        {`Delete Diagram "${deletedDiagramName}"`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-confirmation-dialog-description">
          Are you sure you want to delete this diagram?{" "}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelDelete} color="inherit">
          Cancel
        </Button>
        <Button onClick={confirmDelete} autoFocus color="inherit">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
