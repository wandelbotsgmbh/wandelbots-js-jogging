"use client"

import { getNovaClient } from "../../getWandelApi"
import { observer, useLocalObservable } from "mobx-react-lite"
import { useEffect, type ReactNode } from "react"
import { LoadingScreen } from "./LoadingScreen"
import { WandelApp } from "../../WandelApp"
import { WandelAppContext } from "../../WandelAppContext"

export const WandelAppLoader = observer((props: { children: ReactNode }) => {
  const nova = getNovaClient()

  const state = useLocalObservable(() => ({
    loading: "Initializing" as string | null,
    error: null as unknown | null,
    wandelApp: null as WandelApp | null,

    finishLoading() {
      state.loading = null
    },

    nowLoading(message: string) {
      state.loading = message
    },

    receiveError(error: unknown) {
      console.error(error)
      state.error = error
    },
  }))

  async function loadWandelApp() {
    state.nowLoading(`Loading controllers`)

    /**
     * New V2 list controllers
     */
    let controllers: string[] = []

    try {
      controllers = await nova.api.controller.listRobotControllers()
    } catch (error) {
      console.error("Error: No connection to WandelAPI")
    }

    state.wandelApp = new WandelApp(nova, controllers)

    /**
     * No selected controller and designated motion group, try to
     * select the first available ones
     */
    if (!state.wandelApp.selectedMotionGroupId) {
      const controller = state.wandelApp.controllers?.[0]
      let motionGroup: string | null = null
      let modelFromController: string | null = null
      let controllerKind: string | null = null

      if (controller) {
        /**
         * Fetch controller description (for the motionGroup name and controller kind)
         */
        try {
          const controllerDescriptions =
            await nova.api.controller.getControllerDescription(controller)
          motionGroup =
            controllerDescriptions.connected_motion_groups[0] ?? null

          const controllerDetails =
            await nova.api.controller.getRobotController(controller)
          controllerKind = controllerDetails.configuration.kind
        } catch (error) {
          console.error("Error: No connection to WandelAPI")
        }

        /**
         * Fetch motion group description (for the motion_group_model name)
         */
        if (motionGroup) {
          try {
            const motionGroupDescription =
              await nova.api.motionGroup.getMotionGroupDescription(
                controller,
                motionGroup,
              )
            modelFromController = motionGroupDescription.motion_group_model
          } catch (error) {
            console.error("Error: No connection to WandelAPI")
          }
        }
      }

      /**
       * Carry on, only if all required data is fetched successfully
       * controller - controller name, eg. "abb-irb1200-7"
       * motionGroup - motion group id of the controller, eg. "0@abb-irb1200-7"
       * modelFromController = model name of the motion group, eg. "ABB_1200_07_7"
       * controllerKind = type of controller, eg. "VirtualController"
       */
      if (controller && motionGroup && modelFromController && controllerKind) {
        state.nowLoading(`Configuring motion group`)
        await state.wandelApp.selectMotionGroup(
          controller,
          controllerKind,
          motionGroup,
          modelFromController,
        )
      }
    }
  }

  async function tryLoadWandelApp() {
    try {
      await loadWandelApp()
      state.finishLoading()
    } catch (error) {
      state.receiveError(error)
    }
  }

  useEffect(() => {
    tryLoadWandelApp()
  }, [])

  if (state.loading) {
    return <LoadingScreen message={state.loading} error={state.error} />
  }

  return (
    <WandelAppContext.Provider value={state.wandelApp}>
      {props.children}
    </WandelAppContext.Provider>
  )
})
