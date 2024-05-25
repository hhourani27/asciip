import { Box, Divider, Paper } from "@mui/material";
import { FooterTip } from "./FooterTip";
import { FooterCanvasSize } from "./FooterCanvasSize";
import { FooterInfo } from "./FooterInfo";
import { FooterHistory } from "./FooterHistory";

export function Footer(): JSX.Element {
  return (
    <Paper
      component="footer"
      sx={{
        display: "flex",
        alignItems: "center",
        py: 0,
        px: 3,
      }}
    >
      <Box
        id="left-footer"
        sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 3 }}
      >
        <FooterCanvasSize />
        <Divider orientation="vertical" variant="middle" flexItem />
        <FooterHistory />
        <Divider orientation="vertical" variant="middle" flexItem />
        <FooterTip />
      </Box>
      <Box
        id="right-footer"
        sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
      >
        <FooterInfo />
      </Box>
    </Paper>
  );
}
