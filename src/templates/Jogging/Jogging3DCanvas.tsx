import { Grid, OrbitControls } from "@react-three/drei"

import { Canvas } from "@react-three/fiber"
import { Euler, Object3D, Vector3 } from "three"

import {
  MotionGroupVisualizer,
  PresetEnvironment,
} from "@wandelbots/wandelbots-js-react-components"
import { useActiveRobot } from "@/WandelAppContext"
import { observer } from "mobx-react-lite"
import { env } from "@/runtimeEnv"
import { getSecureUrl } from "@/getWandelApi"

export const Jogging3DCanvas = observer(()=>  {
  Object3D.DEFAULT_UP = new Vector3(0, 0, 1)
  const activeRobot = useActiveRobot()

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

  return (
    <Canvas
      flat={true}
      shadows
      camera={{
        position: [-2, 1, 1],
        rotation: new Euler(0, 0, 0),
        fov: 50,
      }}
      resize={{ debounce: 0, scroll: false }}
    >
      <color attach="background" args={["#303b51"]} />
      <group position={[0, 0, -0]} rotation={[Math.PI / 2, -Math.PI / 3, 0]}>
        <MotionGroupVisualizer
          rapidlyChangingMotionState={activeRobot.rapidlyChangingMotionState}
          modelFromController={activeRobot.modelFromController}
          dhParameters={activeRobot.dhParameters}
          instanceUrl={getSecureUrl(env.WANDELAPI_BASE_URL || "")}
          inverseSolver={activeRobot.inverseSolver}
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
})
