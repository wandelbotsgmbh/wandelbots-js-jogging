import React from "react"
import { Jogging3DCanvas } from "./Jogging3DCanvas"
import { JoggingUI } from "./JoggingUI"
import { Grid } from "@mui/material"

export const Jogging = () => {
  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={8}>
        <Jogging3DCanvas />
      </Grid>
      <Grid item xs={4}>
        <JoggingUI />
      </Grid>
    </Grid>
  )
}
