import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type InfoDialogProps = {
  onClose: () => void;
};

export function InfoDialog({ onClose }: InfoDialogProps): JSX.Element {
  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Asciip"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>
            Asciip is a client-side ASCII diagram editor. It was created mostly
            as a personal challenge, and party to improve on existing diagram
            editors.
          </p>
          <p>
            This app was inspired in large part by the following tools:
            <ul>
              <li>
                <a
                  href="https://asciiflow.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ASCIIFlow
                </a>
              </li>
              <li>
                <a href="https://textik.com/" target="_blank" rel="noreferrer">
                  Textik
                </a>
              </li>
            </ul>
          </p>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
