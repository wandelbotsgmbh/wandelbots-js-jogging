import React from "react"
import { Grid, Stack, useTheme } from "@mui/material"
import { useActiveRobot, useWandelApp } from "../../WandelAppContext"
import { JoggingPanel } from "@wandelbots/wandelbots-js-react-components"

export const JoggingUI = () => {
  const wandelApp = useWandelApp()
  const activeRobot = useActiveRobot()
  const theme = useTheme()

  return (
    <div
      style={{
        backgroundColor: theme.palette.backgroundPaperElevation?.[5],
        height: "100%",
        width: "100%",
      }}
    >
      <JoggingPanel
        nova={wandelApp.nova}
        motionGroupId={activeRobot.motionGroupId}
      />
    </div>
  )
}
