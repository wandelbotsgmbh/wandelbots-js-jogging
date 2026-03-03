import type {
  ControllerInstance,
  MotionGroupPhysical,
} from "@wandelbots/nova-api/v1"
import { flatten, keyBy } from "lodash-es"
import { makeAutoObservable } from "mobx"
import type { ConnectedMotionGroup, NovaClient } from "@wandelbots/nova-js/v1"
import { ProgramStateConnection } from "@wandelbots/nova-js/v1"
import { getNovaClientV2 } from "@/getWandelApi"
import {
  JointTypeEnum,
  type DHParameter,
  type KinematicModel,
} from "@wandelbots/nova-js/v2"

/**
 * Main store for the current state of the robot pad.
 */
export class WandelApp {
  selectedMotionGroupId: string | null = null

  programRunner: ProgramStateConnection | null = null

  /**
   * Represents the current state of the selected motion group
   * after setup and websocket connection */
  activeRobot: ConnectedMotionGroup | null = null

  inverseSolver: string | null | undefined = undefined
  dhParameters: DHParameter[] = []
  jointType: JointTypeEnum = JointTypeEnum.RevoluteJoint

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
    this.activeRobot = await this.nova.connectMotionGroup(motionGroupId)
    this.selectedMotionGroupId = motionGroupId

    const modelFromController =
      this.motionGroupOptionsById[motionGroupId].model_from_controller

    await this.fetchKinematicModel(modelFromController)
  }

  async startProgramRunner() {
    this.programRunner = new ProgramStateConnection(this.nova)
  }

  /**
   * Fetches the kinematic model for the motion group from the API.
   */
  async fetchKinematicModel(modelFromController: string) {
    const novaV2 = getNovaClientV2()

    try {
      const { inverse_solver, dh_parameters }: KinematicModel =
        await novaV2.api.motionGroupModels.getMotionGroupKinematicModel(
          modelFromController!,
        )

      this.inverseSolver = inverse_solver

      this.dhParameters = dh_parameters ?? []

      /**
       * TODO as soon as V2 api migration is done, the setting of the DEFAULT RevoluteJoint value should be
       *  deleted, cause the type property is expected to be always delivered. It is not the case in the V1 at the
       *  moment. "this.jointType = dh_parameters[0]?.type" is the desired assign.
       */
      if (dh_parameters?.length) {
        this.jointType = dh_parameters[0]?.type ?? JointTypeEnum.RevoluteJoint
      }
    } catch (err) {
      console.warn(
        `Failed to fetch kinematic model from API for ${modelFromController}, falling back to local config`,
      )
    }
  }
}
