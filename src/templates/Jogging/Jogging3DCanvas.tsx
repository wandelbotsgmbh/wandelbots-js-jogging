import { Grid, OrbitControls } from "@react-three/drei"

import { Canvas } from "@react-three/fiber"
import { Euler, Object3D, Vector3 } from "three"

import {
  MotionGroupVisualizer,
  PresetEnvironment,
  type SupportedLinearAxisProps,
  type SupportedRobotProps,
} from "@wandelbots/wandelbots-js-react-components"
import { useActiveRobot, useWandelApp } from "@/WandelAppContext"
import { useMemo } from "react"
import { transformIntoV2MotionState } from "@/util/transformIntoV2MotionState"
import { env } from "@/runtimeEnv"

export function Jogging3DCanvas() {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1)
  const activeRobot = useActiveRobot()
  const { inverseSolver } = useWandelApp()

  const { gridSize, ...gridConfig } = {
    gridSize: [200, 200],
    sectionSize: 0.25,
    sectionThickness: 1.0,
    sectionColor: "#6278a2",
    fadeDistance: 9,
    fadeStrength: 2,
    followCamera: false,
    infiniteGrid: true,
  }

  /**
   * Returns props to be used inside the SupportedLinearAxis and SupporterRobot
   * visualization components
   *
   * TODO @v2-api as soon as the migration is done, you can just
   *  pass activeRobot.rapidlyChangingMotionState as prop without
   *  the need of mapping any values - delete this as soon
   *  as V2 migration is done
   */
  const motionProps = useMemo<
    SupportedLinearAxisProps | SupportedRobotProps
  >(() => {
    return {
      rapidlyChangingMotionState: transformIntoV2MotionState(
        activeRobot.rapidlyChangingMotionState.state,
      ),
      modelFromController: activeRobot.modelFromController || "",
      dhParameters: activeRobot.dhParameters as any,
    }
  }, [activeRobot.rapidlyChangingMotionState])

  return (
    <Canvas
      flat={true}
      shadows
      camera={{
        position: [-2, 1, 1],
        rotation: new Euler(0, 0, 0),
        fov: 25,
      }}
      resize={{ debounce: 0, scroll: false }}
    >
      <color attach="background" args={["#303b51"]} />
      <group position={[0, 0, -0]} rotation={[Math.PI / 2, -Math.PI / 3, 0]}>
        <MotionGroupVisualizer
          instanceUrl={
            typeof window !== "undefined"
              ? new URL(env.WANDELAPI_BASE_URL || "", window.location.origin)
                  .href
              : env.WANDELAPI_BASE_URL || ""
          }
          inverseSolver={inverseSolver}
          {...motionProps}
        />
        <group
          position={[0, 0, 0.01]}
          rotation={[-Math.PI / 2, -Math.PI * 2, 0]}
        >
          <Grid
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            args={
              gridSize as
                | [
                    width?: number | undefined,
                    height?: number | undefined,
                    widthSegments?: number | undefined,
                    heightSegments?: number | undefined,
                  ]
                | undefined
            }
            {...gridConfig}
          />
          <OrbitControls />
          <PresetEnvironment />
        </group>
      </group>
    </Canvas>
  )
}
