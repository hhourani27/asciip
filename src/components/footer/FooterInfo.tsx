import { ButtonGroup, IconButton, Tooltip } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import { InfoDialog } from "../dialogs/InfoDialog";

export function FooterInfo(): JSX.Element {
  const [infoDialogOpen, setInfoDialogOpen] = useState<boolean>(false);

  return (
    <>
      <ButtonGroup size="small">
        <Tooltip title="What is this?" arrow>
          <IconButton
            aria-label="info"
            size="medium"
            onClick={() => setInfoDialogOpen(true)}
          >
            <InfoIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="View GitHub repo" arrow>
          <IconButton
            aria-label="View GitHub repo"
            size="medium"
            onClick={() =>
              window.open(
                "https://github.com/hhourani27/ascii-diagram",
                "_blank"
              )
            }
          >
            <GitHubIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
      {infoDialogOpen && (
        <InfoDialog onClose={() => setInfoDialogOpen(false)} />
      )}
    </>
  );
}
