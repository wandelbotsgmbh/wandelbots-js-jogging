import { Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { CopyableText } from "./CopyableText"

export const PoseJointValues = observer(({ pose }: { pose: number[] }) => {
  const poseStr = `[${pose.map((j) => parseFloat(j.toFixed(4))).join(", ")}]`

  return (
    <Stack
      alignItems="left"
      spacing={2}
      sx={{ flexGrow: 1, minWidth: 0, overflow: "hidden" }}
      data-testid="pose-joint-values"
    >
      <CopyableText value={poseStr} />
    </Stack>
  )
})
