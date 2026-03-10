import { observer } from "mobx-react-lite"
import { useMemo } from "react"
import { Stack, type StackOwnProps } from "@mui/material"
import { radiansToDegrees } from "@wandelbots/nova-js"
import { useActiveRobot } from "@/WandelAppContext"

const stackStyling: StackOwnProps = {
  direction: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  spacing: 0.5,
  letterSpacing: 0.6,
  fontSize: "0.875rem",
  color: "white",
}

export const JoggingStateStream = observer(() => {
  const activeRobot = useActiveRobot()

  const axisConfig = useMemo(() => {
    return activeRobot.rapidlyChangingMotionState.joint_position.filter(
      (item) => item !== undefined,
    )
  }, [activeRobot.rapidlyChangingMotionState])

  return [
    <Stack key={"connection-status"} {...stackStyling}>
      <span style={{ color: "#ffffff88" }}>Connection status:</span>
      <span style={{ color: "#2affbf" }}>connected</span>
    </Stack>,
    <Stack key={"connected-with"} {...stackStyling}>
      <span style={{ color: "#ffffff88" }}>Connected with:</span>
      <span>{activeRobot.modelFromController}</span>
      <span>{activeRobot.motionGroupId}</span>
    </Stack>,
    <Stack key={"axis-joints"} {...stackStyling}>
      <span style={{ color: "#ffffff88" }}>Joints information:</span>
      {axisConfig.map((joint, index) => [
        <span key={index}>
          Joint {index + 1}: {Math.round(radiansToDegrees(joint))}°
        </span>,
      ])}
    </Stack>,
  ]
})
