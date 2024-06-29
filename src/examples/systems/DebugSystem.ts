import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";
import { MovementDirection } from "../enums/MovementDirection";

export class DebugSystem implements ISystem {
  game_mode: GameMode[] = [GameMode.Running, GameMode.Pause];
  events: GameEvent[] = [GameEvent.Tick];

  start(_w: ECS): void {
    // console.log(w)
    // console.log(w.ge_systems)
    // console.log(w.systems)
  }
  destroy(_: ECS): void { }

  process(_w: ECS, _dt: number, _event: EventCall<GameEvent.Keyboard, MovementDirection>): void {
  }
}
