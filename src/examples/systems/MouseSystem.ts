import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";

export class MouseSystem implements ISystem {
  game_mode = [GameMode.Running];
  events: number[] = [GameEvent.Tick]

  start(w: ECS): void {
    window.addEventListener("wheel", (event: WheelEvent) => {
      const eventCall: EventCall<GameEvent, number> = {
        type: GameEvent.CameraZoom,
        data: event.deltaY
      }
      w.registerEvent(eventCall)
    })

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.log("click direito bloqueado")
    })
  }

  process(_w: ECS, _dt: number, _event?: any): void {
    return
  }

  destroy(_w: ECS): void {
    return
  }

}