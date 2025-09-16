import { useTheme } from "@mui/material"
import { useActiveRobot, useWandelApp } from "../../WandelAppContext"
import {
  JoggingPanel,
  SafetyBar,
  PoseCartesianValues,
  PoseJointValues,
} from "@wandelbots/wandelbots-js-react-components"
import { observer } from "mobx-react-lite"
import type { Joints } from "@wandelbots/nova-js/v1"

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

      <PoseCartesianValues
        tcpPose={(() => {
          const motionState = activeRobot.rapidlyChangingMotionState
          const state = motionState?.state
          const tcpPose = state?.tcp_pose

          const pose = tcpPose || {
            tcp: "TCP1",
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0 },
          }
          return pose
        })()}
      />
      <PoseJointValues
        joints={(() => {
          const motionState = activeRobot.rapidlyChangingMotionState
          const state = motionState?.state
          const joints = state?.joint_position

          const pose = joints || ({ joints: [0, 0, 0, 0, 0, 0] } as Joints)
          return pose
        })()}
      />
    </div>
  )
})
