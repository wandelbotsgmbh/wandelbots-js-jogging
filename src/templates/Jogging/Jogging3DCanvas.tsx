import { Grid, OrbitControls } from "@react-three/drei"

import { Canvas } from "@react-three/fiber"
import { Euler, Object3D, Vector3 } from "three"

import { PresetEnvironment } from "@wandelbots/wandelbots-js-react-components"
import { Robot } from "@wandelbots/wandelbots-js-react-components"
import { useActiveRobot } from "@/WandelAppContext"

export function Jogging3DCanvas() {
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
        fov: 25,
      }}
      resize={{ debounce: 0, scroll: false }}
    >
      <color attach="background" args={["#303b51"]} />

      <group position={[0, 0, -0]} rotation={[Math.PI / 2, -Math.PI / 3, 0]}>
        <Robot connectedMotionGroup={activeRobot} />
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
