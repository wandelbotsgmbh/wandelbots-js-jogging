import React from "react"
import { Jogging3DCanvas } from "./Jogging3DCanvas"
import { JoggingUI } from "./JoggingUI"
import { Box } from "@mui/material"

export const Jogging = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ flex: 2 }}>
        <Jogging3DCanvas />
      </Box>
      <Box sx={{ flex: 1 }}>
        <JoggingUI />
      </Box>
    </Box>
  )
}
