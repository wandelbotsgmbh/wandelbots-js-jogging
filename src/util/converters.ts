import { Pose } from "@wandelbots/nova-js/v1"

export function poseToWandelscriptString(
  pose: Pick<Pose, "position" | "orientation">,
  opts: {
    positionPrecision?: number
    rotationPrecision?: number
  } = {},
) {
  const positionPrecision = opts.positionPrecision ?? 1
  const rotationPrecision = opts.rotationPrecision ?? 4

  const position = [pose.position.x, pose.position.y, pose.position.z]
  const orientation = [
    pose.orientation?.x ?? 0,
    pose.orientation?.y ?? 0,
    pose.orientation?.z ?? 0,
  ]

  const positionValues = position.map((v) =>
    parseFloat(v.toFixed(positionPrecision)),
  )
  // Rotation needs more precision since it's in radians
  const rotationValues = orientation.map((v) =>
    parseFloat(v.toFixed(rotationPrecision)),
  )

  return `(${positionValues.concat(rotationValues).join(", ")})`
}
