import { poseToWandelscriptString } from "@/util/converters"
import { Stack } from "@mui/material"
import type { TcpPose } from "@wandelbots/nova-js/v1"
import { observer } from "mobx-react-lite"
import { CopyableText } from "./CopyableText"

export const PoseCartesianValues = observer(({ pose }: { pose: TcpPose }) => {
  return (
    <Stack
      alignItems="left"
      spacing={2}
      sx={{ flexGrow: 1, minWidth: 0, overflow: "hidden" }}
      data-testid="pose-cartesian-values"
    >
      <CopyableText value={poseToWandelscriptString(pose)} />
    </Stack>
  )
})
