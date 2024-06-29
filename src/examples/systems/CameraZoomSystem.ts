import { CameraData } from "../../ecs/components_data";
import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { ComponentType as CT } from "../enums/ComponentType";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";

export class CameraZoomSystem implements ISystem {
  game_mode: GameMode[] = [GameMode.Running];
  events: GameEvent[] = [GameEvent.CameraZoom];

  start(_w: ECS): void {  }
  destroy(_: ECS): void { }

  process(w: ECS, _: any, event: EventCall<GameEvent, number>): void {
    const zoom: boolean = event.data < 0 ? true : false;
    w.query_system
      .contains([
        CT.Camera
      ])
      .each((entity: number) => {
        const camera_key = parseInt(`${entity}${CT.Camera}`)
        const camera: CameraData = w.components[w.ect[camera_key]]

        if (zoom) {
          if (camera.zoom > camera.maxZoom) { return }
        } else {
          if (camera.zoom < camera.minZoom) { return }
        }
        w.components[w.ect[camera_key]].zoom += zoom ? 0.1 : -0.1;
      })
  }
}
