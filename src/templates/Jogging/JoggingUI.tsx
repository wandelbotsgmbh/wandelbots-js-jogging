import { useMemo } from "react"
import { observer } from "mobx-react-lite"
import { useTheme } from "@mui/material"

import {
  JoggingPanel,
  PoseCartesianValues,
  PoseJointValues,
  SafetyBar,
} from "@wandelbots/wandelbots-js-react-components"
import type { Pose } from "@wandelbots/nova-js/v2"

import { useActiveRobot, useWandelApp } from "../../WandelAppContext"

export const JoggingUI = observer(() => {
  const activeRobot = useActiveRobot()
  const { selectedMotionGroupId  } = useWandelApp()
  const theme = useTheme()

  const tcpPose = useMemo<Pose>(() => {
    return (
      activeRobot.rapidlyChangingMotionState.tcp_pose ?? {
        position: [0,0,0],
        orientation: [0,0,0],
      }
    )
  }, [activeRobot.rapidlyChangingMotionState])

  const jointsPose = useMemo(() => {
    const motionState = activeRobot.rapidlyChangingMotionState
    return motionState?.joint_position
  }, [activeRobot.rapidlyChangingMotionState])

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
      {selectedMotionGroupId && (
        <JoggingPanel
          nova={activeRobot.nova}
          motionGroupId={selectedMotionGroupId}
        />
      )}
      <PoseCartesianValues tcpPose={tcpPose} />

      <PoseJointValues joints={jointsPose} />
    </div>
  )
})
