import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { appActions } from "../../store/appSlice";

export function RenameDiagramFormDialog(): JSX.Element {
  const dispatch = useAppDispatch();

  const renamedDiagramId = useAppSelector(
    (state) => state.app.renameDiagramInProgress
  )!;

  const renamedDiagramName: string = useAppSelector(
    (state) => state.app.diagrams.find((d) => d.id === renamedDiagramId)!.name
  );

  const confirmRename = (name: string) => {
    dispatch(appActions.renameDiagram({ id: renamedDiagramId, newName: name }));
  };

  const cancelRename = () => {
    dispatch(appActions.cancelRenameDiagram());
  };

  return (
    <Dialog
      open
      onClose={cancelRename}
      disableRestoreFocus //fix autofocus issue (see https://stackoverflow.com/a/76533962/471461)
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const name = formJson.name;
          confirmRename(name);
        },
      }}
    >
      <DialogTitle>Rename Diagram</DialogTitle>
      <DialogContent>
        <DialogContentText>Type the new diagram name.</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="diagram_name"
          name="name"
          label="Diagram name"
          type="text"
          fullWidth
          variant="standard"
          defaultValue={renamedDiagramName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelRename} color="inherit">
          Cancel
        </Button>
        <Button type="submit" color="inherit">
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
}
