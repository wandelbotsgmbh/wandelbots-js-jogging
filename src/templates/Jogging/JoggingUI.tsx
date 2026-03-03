import { useTheme } from "@mui/material"
import { useActiveRobot, useWandelApp } from "../../WandelAppContext"
import {
  JoggingPanel,
  SafetyBar
} from "@wandelbots/wandelbots-js-react-components"
import { observer } from "mobx-react-lite"
import type { Joints } from "@wandelbots/nova-js/v1"
import { getNovaClientV2 } from "@/getWandelApi"
import { useMemo } from "react"
import { PoseCartesianValues } from "./PoseCartesianValues"
import { PoseJointValues } from "@/templates/Jogging/PoseJointValues"

export const JoggingUI = observer(() => {
  const activeRobot = useActiveRobot()
  const { selectedMotionGroupId  } = useWandelApp()
  const theme = useTheme()

  const novaV2 = getNovaClientV2()

  const tcpPose = useMemo(() => {
    const motionState = activeRobot.rapidlyChangingMotionState
    const state = motionState?.state
    const tcpPose = state?.tcp_pose

    const pose = tcpPose || {
      tcp: "TCP1",
      position: { x: 0, y: 0, z: 0 },
      orientation: { x: 0, y: 0, z: 0 },
    }
    return pose
  }, [activeRobot])

  const jointsPose = useMemo(() => {
    const motionState = activeRobot.rapidlyChangingMotionState
    const state = motionState?.state
    return state?.joint_position.joints
  }, [activeRobot])

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
        <JoggingPanel nova={novaV2} motionGroupId={selectedMotionGroupId} />
      )}
      <PoseCartesianValues pose={tcpPose} />
      <PoseJointValues pose={jointsPose} />
    </div>
  )
})
