import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import { appActions } from "../../store/appSlice";

export function CreateDiagramFormDialog(): JSX.Element {
  const dispatch = useAppDispatch();

  const confirmCreate = (name: string) => {
    dispatch(appActions.createDiagram(name));
  };

  const cancelCreate = () => {
    dispatch(appActions.cancelCreateDiagram());
  };

  return (
    <Dialog
      open
      onClose={cancelCreate}
      disableRestoreFocus //fix autofocus issue (see https://stackoverflow.com/a/76533962/471461)
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const name = formJson.name;
          confirmCreate(name);
        },
      }}
    >
      <DialogTitle>New Diagram</DialogTitle>
      <DialogContent>
        <DialogContentText>Chose the diagram name.</DialogContentText>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelCreate} color="inherit">
          Cancel
        </Button>
        <Button type="submit" color="inherit">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
