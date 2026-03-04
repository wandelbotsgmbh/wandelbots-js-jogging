"use client"

import { getNovaClient, getNovaClientV2 } from "../../getWandelApi"
import { observer, useLocalObservable } from "mobx-react-lite"
import { useEffect, type ReactNode } from "react"
import { LoadingScreen } from "./LoadingScreen"
import { WandelApp } from "../../WandelApp"
import { WandelAppContext } from "../../WandelAppContext"

export const WandelAppLoader = observer((props: { children: ReactNode }) => {
  const nova = getNovaClient()
  const novaV2 = getNovaClientV2()

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

    let controllersRes
    try {
      /**
       * TODO "The v2 endpoint currently only lists the names of connected controllers, not their configurations.
       *  If you need the configuration of a controller, please use the v endpoint for now."
       *  https://docs.wandelbots.io/26.1/api-maintained/migrationguide#use-v1-endpoints-for-these-functionalities
       */
      controllersRes = await nova.api.controller.listControllers()

      console.log(controllersRes)
    } catch (error) {
      console.error("Error: No connection to WandelAPI")
    }

    const availableControllers = controllersRes?.instances || []

    console.log(`Available controllers:\n  `, availableControllers)

    state.wandelApp = new WandelApp(novaV2, availableControllers)

    if (!state.wandelApp.selectedMotionGroupId) {
      // No saved motion group, try to select the first available
      const motionGroup = state.wandelApp.motionGroupOptions[0]
      if (motionGroup) {
        state.nowLoading(`Configuring motion group`)
        await state.wandelApp.selectMotionGroup(motionGroup.motion_group)
      }
    }

    state.nowLoading(`Connecting programs runner`)
    // TODO v2 check
    // state.wandelApp.startProgramRunner()

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
