import { DirectionalLightData, PositionData, RotationData, SpeedData } from "../../ecs/components_data";
import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { ComponentType as CT } from "../enums/ComponentType";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";
import { MovementDirection } from "../enums/MovementDirection";

import * as dat from 'dat.gui';

export class DatGUISystem implements ISystem {
  game_mode: GameMode[] = [GameMode.Running, GameMode.Pause];
  events: GameEvent[] = [GameEvent.Tick];
  dat: any;

  start(w: ECS): void {
    this.dat = new dat.GUI();

    const cpRotation = this.dat.addFolder("Camera Rotate")

    w.query_system
      .contains([CT.Camera])
      .each((entity: number) => {
        const rotation: RotationData = w.getComponent(entity, CT.Rotation);
        cpRotation.add(rotation, 'x', 0, 1)
        cpRotation.add(rotation, 'y', 0, 1)
        cpRotation.add(rotation, 'z', 0, 1)
      })
    const player = this.dat.addFolder("Player");

    w.query_system
      .contains([CT.Player])
      .each((entity: number) => {
        const position: PositionData = w.getComponent(entity, CT.Position);
        const speed: SpeedData = w.getComponent(entity, CT.Speed);
        player.add(position, 'x').min(0).max(100).step(1);
        player.add(position, 'y').min(0).max(100).step(1);
        player.add(position, 'z').min(0).max(100).step(1);
        player.add(speed, 'speed').min(0).max(100).step(1);
      })

    const luzes = this.dat.addFolder("Lights");

    w.query_system
      .contains([CT.DirectionalLight])
      .each((entity: number) => {
        const light_position: PositionData = w.getComponent(entity, CT.Position);
        // const light_data: DirectionalLightData = w.getComponent(entity, CT.DirectionalLight)

        luzes.add(light_position, 'x').min(0).max(100).step(1);
        luzes.add(light_position, 'y').min(0).max(100).step(1);
        luzes.add(light_position, 'z').min(0).max(100).step(1);
      })


  }
  destroy(_: ECS): void { }

  process(_w: ECS, _dt: number, _event: EventCall<GameEvent.Keyboard, MovementDirection>): void {
  }
}
