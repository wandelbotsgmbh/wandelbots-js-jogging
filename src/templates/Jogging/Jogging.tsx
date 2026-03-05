import React from "react"
import { Jogging3DCanvas } from "./Jogging3DCanvas"
import { JoggingUI } from "./JoggingUI"
import { Box } from "@mui/material"
import { observer } from "mobx-react-lite"

export const Jogging = observer(() => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "#303b51",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Jogging3DCanvas />
      </Box>
      <Box
        sx={{
          width: "30%",
          overflow: "auto",
          borderRadius: "16px",
          height: "calc(100%  12px)",
          marginTop: "6px",
        }}
      >
        <JoggingUI />
      </Box>
    </Box>
  )
})
