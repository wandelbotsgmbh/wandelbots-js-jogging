import React from "react"
import { useTheme } from "@mui/material"
import { useActiveRobot, useWandelApp } from "../../WandelAppContext"
import {
  JoggingPanel,
  SafetyBar,
} from "@wandelbots/wandelbots-js-react-components"
import { observer } from "mobx-react-lite"

export const JoggingUI = observer(() => {
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
      <SafetyBar
        isVirtual={activeRobot.isVirtual}
        motionGroupId={activeRobot.motionGroupId}
        operationMode={activeRobot.controllerState.operation_mode}
        safetyState={activeRobot.controllerState.safety_state}
      />
      <JoggingPanel
        nova={wandelApp.nova}
        motionGroupId={activeRobot.motionGroupId}
      />
    </div>
  )
})
