import React from "react"
import { Box } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useActiveRobot } from "@/WandelAppContext"
import { SafetyBar } from "@wandelbots/wandelbots-js-react-components"
import { JoggingStateStream } from "@/templates/Jogging/JoggingStateStream"

import { Jogging3DCanvas } from "./Jogging3DCanvas"
import { JoggingUI } from "./JoggingUI"

export const Jogging = observer(() => {
  const activeRobot = useActiveRobot()

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "#303b51",
        positon: "relative",
      }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
        <Jogging3DCanvas />
      </Box>
      <Box
        sx={{
          width: "30%",
          overflow: "auto",
          borderRadius: "16px",
          height: "calc(100% - 12px)",
          marginTop: "6px",
        }}
      >
        <JoggingUI />
      </Box>
      <Box
        sx={{
          position: "absolute",
          padding: "0 12px",
          top: "12px",
          left: 0,
        }}
      >
        <SafetyBar
          isVirtual={activeRobot.isVirtual}
          motionGroupId={activeRobot.motionGroupId}
          operationMode={activeRobot.controllerState.operation_mode}
          safetyState={activeRobot.controllerState.safety_state}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "70%",
          position: "absolute",
          padding: "0 12px",
          left: 0,
          bottom: "12px",
          flexDirection: "row",
          gap: "12px",
        }}
      >
        <JoggingStateStream />
      </Box>
    </Box>
  )
})
