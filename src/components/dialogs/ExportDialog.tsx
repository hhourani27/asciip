import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  ListItemText,
  Typography,
  Chip,
  FormControl,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";
import { FONT_FAMILY } from "../canvas/draw";
import { COMMENT_STYLE, getTextExport } from "../../models/representation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

const commentStyleDisplay: {
  [key in COMMENT_STYLE]: {
    name: string;
    exemple?: string;
    languages?: string;
  };
} = {
  NONE: { name: "None" },
  STANDARD_BLOCK: {
    name: "Standard block comment",
    exemple: "/* ~ */",
    languages: "Many C-style languages, CSS, Kotlin, Scala...",
  },
  STANDARD_BLOCK_ASTERISK: {
    name: "Asterisk-aligned block comment",
    exemple: "/* * */",
    languages: "Many C-style languages, CSS, Kotlin, Scala...",
  },
  SLASHES: {
    name: "Slashes",
    exemple: "//",
    languages: "Many C-style languages, Kotlin, Scala...",
  },
  HASHES: {
    name: "Hashes",
    exemple: "#",
    languages: "Python, Ruby, PHP, PowerShell...",
  },
  TRIPLE_QUOTES: {
    name: "Triple quote",
    exemple: '""" ~ """',
    languages: "Python, Julia...",
  },
  TRIPLE_SLASH: {
    name: "Triple slash",
    exemple: "///",
    languages: "C#, F#",
  },
  DOUBLE_DASH: {
    name: "Double dash",
    exemple: "--",
    languages: "SQL, Haskell, Ada, Lua, VHDL...",
  },
  APOSTROPHE: {
    name: "Apostrophe",
    exemple: "'",
    languages: "Visual Basic family...",
  },
  TRIPLE_BACKTICK: {
    name: "Triple backticks",
    exemple: "``` ~ ```",
    languages: "Markdown",
  },
  FOUR_SPACES: {
    name: "Four spaces",
    exemple: "\u00a0\u00a0\u00a0\u00a0",
    languages: "Markdown",
  },
  SEMI_COLON: {
    name: "Semi-colon",
    exemple: ";",
    languages: "Lua, Scheme, Assembly...",
  },
  PERCENT: {
    name: "Percent",
    exemple: "%",
    languages: "TeX, LaTeX, PostScript, Erlang...",
  },
};

function renderCommentStyleValue(commentStyle: COMMENT_STYLE): React.ReactNode {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography sx={{ display: "inline" }} component="span" variant="body1">
        {commentStyleDisplay[commentStyle].name}
      </Typography>
      {commentStyleDisplay[commentStyle].exemple && (
        <Chip
          label={commentStyleDisplay[commentStyle].exemple}
          variant="outlined"
          size="small"
          sx={{ borderRadius: "8px", ml: 1 }}
        />
      )}
    </Box>
  );
}

export function ExportDialog() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const exportInProgress = useAppSelector(
    (state) => state.diagram.exportInProgress
  );

  const shapeObjs = useAppSelector((state) => state.diagram.shapes);
  const styleMode = useAppSelector((state) => state.diagram.styleMode);
  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);

  const [commentStyle, setCommentStyle] =
    useState<COMMENT_STYLE>("STANDARD_BLOCK");

  const exportText = getTextExport(
    shapeObjs,
    {
      styleMode,
      globalStyle,
    },
    commentStyle
  );

  const copyDiagramToClipboard = async () => {
    await navigator.clipboard.writeText(exportText);
  };

  return (
    <Dialog
      open={exportInProgress}
      onClose={() => dispatch(diagramActions.closeExport())}
      maxWidth="lg"
    >
      <DialogTitle>Export diagram</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="comment-style-label">Comment style</InputLabel>
          <Select
            labelId="comment-style-label"
            id="comment-style"
            value={commentStyle}
            label="Comment style"
            onChange={(e: SelectChangeEvent<COMMENT_STYLE>) =>
              setCommentStyle(e.target.value as COMMENT_STYLE)
            }
            renderValue={renderCommentStyleValue}
          >
            {Object.keys(commentStyleDisplay).map((value) => (
              <MenuItem key={value} value={value}>
                <ListItemText
                  primary={renderCommentStyleValue(value as COMMENT_STYLE)}
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="caption"
                    >
                      {commentStyleDisplay[value as COMMENT_STYLE].languages}
                    </Typography>
                  }
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            fontFamily: FONT_FAMILY,
            fontSize: "12px",
            lineHeight: 1.25,
            maxWidth: "50vw",
            maxHeight: "50vh",
            overflow: "auto",
            whiteSpace: "pre",
            p: 1,
            backgroundColor: theme.canvas.background,
            color: theme.canvas.shape,
            scrollbarColor: `${theme.palette.primary.light} ${theme.palette.primary.main}`,
            scrollbarWidth: "thin",
          }}
        >
          {exportText}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={copyDiagramToClipboard}
          startIcon={<ContentCopyIcon />}
          color="inherit"
        >
          Copy diagram
        </Button>
      </DialogActions>
    </Dialog>
  );
}
