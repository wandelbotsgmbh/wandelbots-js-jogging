import { useMemo } from "react"
import { observer } from "mobx-react-lite"
import { Box, Divider, useTheme } from "@mui/material"

import {
  JoggingPanel,
  PoseCartesianValues,
  PoseJointValues,
} from "@wandelbots/wandelbots-js-react-components"
import type { Pose } from "@wandelbots/nova-js/v2"

import { useActiveRobot, useWandelApp } from "../../WandelAppContext"

export const JoggingUI = observer(() => {
  const activeRobot = useActiveRobot()
  const { selectedMotionGroupId } = useWandelApp()
  const theme = useTheme()

  const tcpPose = useMemo<Pose>(() => {
    return (
      activeRobot.rapidlyChangingMotionState.tcp_pose ?? {
        position: [0, 0, 0],
        orientation: [0, 0, 0],
      }
    )
  }, [activeRobot.rapidlyChangingMotionState])

  const jointsPose = useMemo(() => {
    const motionState = activeRobot.rapidlyChangingMotionState
    return motionState?.joint_position
  }, [activeRobot.rapidlyChangingMotionState])

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.backgroundPaperElevation?.[5],
        height: "100%",
        width: "100%",
        overflow: "auto",

        "& > .MuiStack-root": {
          maxWidth: "100%",
        },
      }}
    >
      {selectedMotionGroupId && (
        <JoggingPanel
          nova={activeRobot.nova}
          motionGroupId={selectedMotionGroupId}
        />
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Divider
          sx={{
            maxWidth: "460px",
          }}
        />
        <PoseCartesianValues tcpPose={tcpPose} />
        <PoseJointValues joints={jointsPose} />
      </Box>
    </Box>
  )
})
