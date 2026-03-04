import type {
  ControllerInstance,
  MotionGroupPhysical,
} from "@wandelbots/nova-api/v1"
import { flatten, keyBy } from "lodash-es"
import { makeAutoObservable } from "mobx"
import type { ConnectedMotionGroup } from "@wandelbots/nova-js/v1"
import { NovaClient, type RobotControllerState } from "@wandelbots/nova-js/v2"
import { getNovaClientV2 } from "@/getWandelApi"
import {
  JointTypeEnum,
  type DHParameter,
  type KinematicModel,
} from "@wandelbots/nova-js/v2"
import { ActiveRobot } from "@/ActiveRobot"
import { tryParseJson } from "@wandelbots/nova-js"

/**
 * Main store for the current state of the robot pad.
 */
export class WandelApp {
  selectedMotionGroupId: string | null = null

  // TODO v2 check
  //programRunner: ProgramStateConnection | null = null

  /**
   * Represents the current state of the selected motion group
   * after setup and websocket connection */
  activeRobot: ActiveRobot | null = null

  constructor(
    readonly nova: NovaClient,
    readonly availableControllers: ControllerInstance[],
  ) {
    ;(window as any).wandelApp = this
    makeAutoObservable(this)
  }

  get motionGroupOptions() {
    return flatten(
      this.availableControllers.map(
        (controller) => controller.physical_motion_groups,
      ),
    )
  }

  get motionGroupOptionsById() {
    return keyBy(this.motionGroupOptions, (mg) => mg.motion_group)
  }

  get motionGroup() {
    if (!this.selectedMotionGroupId) return null

    const motionGroup = this.motionGroupOptionsById[this.selectedMotionGroupId]
    if (!motionGroup) {
      throw new Error(
        `Invalid motion group selection id ${this.selectedMotionGroupId}`,
      )
    }
    return motionGroup
  }

  async selectMotionGroup(motionGroupId: string) {
    this.selectedMotionGroupId = motionGroupId

    const modelFromController =
      this.motionGroupOptionsById[motionGroupId].model_from_controller

    const controller = this.availableControllers.find((controller) => {
      return controller.physical_motion_groups.some(
        (motionGroup) => motionGroup.motion_group === motionGroupId,
      )
    })

    if (controller) {
      // Open the websocket to monitor controller state for e.g. e-stop
      const controllerStateSocket = this.nova.openReconnectingWebsocket(
        `/controllers/${controller.controller}/state-stream`,
      )

      /**
       * Wait for the first message to get the initial state
       */
      const firstControllerMessage = await controllerStateSocket.firstMessage()
      const initialControllerState = tryParseJson(firstControllerMessage.data)
        ?.result as RobotControllerState

      /**
       * Wait for the kinematic model of the robot before setting it as active
       * and triggering the render
       */
      const activeRobot = new ActiveRobot(
        this.nova,
        modelFromController,
        motionGroupId,
        this.motionGroupOptionsById[motionGroupId].controller_configuration,
        initialControllerState,
        controllerStateSocket,
      )

      await activeRobot.fetchKinematicModel(modelFromController)

      this.activeRobot = activeRobot
    }
  }

  // TODO v2 check if needed at all
  // async startProgramRunner() {
  //   this.programRunner = new ProgramStateConnection(this.nova)
  // }
}
