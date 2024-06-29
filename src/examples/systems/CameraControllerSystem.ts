import { Vector3 } from "three";
import { PositionData, RotationData } from "../../ecs/components_data";
import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { ComponentType as CT } from "../enums/ComponentType";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";

export type CameraControlData = {
  isDragging: boolean;
  previousMousePosition: { x: number, y: number };
}
export class CameraControlSystem implements ISystem {
  game_mode: GameMode[] = [GameMode.Running];
  events: GameEvent[] = [GameEvent.CameraMouse];
  world: ECS;

  canvas: HTMLCanvasElement;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.addEventListeners();
  }

  addEventListeners() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onMouseDown(event: MouseEvent) {
    this.world.query_system
      .contains([CT.CameraControl])
      .each((entity: number) => {
        const cameraControl: CameraControlData = this.world.getComponent(entity, CT.CameraControl)
        cameraControl.isDragging = true;
        cameraControl.previousMousePosition = { x: event.clientX, y: event.clientY };
      });
  }

  onMouseUp(_event: MouseEvent) {
    this.world.query_system
      .contains([CT.CameraControl])
      .each((entity: number) => {
        const cameraControl: CameraControlData = this.world.getComponent(entity, CT.CameraControl)
        cameraControl.isDragging = false;
      });
  }

  onMouseMove(event: MouseEvent) {
    this.world.query_system
      .contains([CT.Camera, CT.CameraControl])
      .each((entity: number) => {
        const cameraControl: CameraControlData = this.world.getComponent(entity, CT.CameraControl)

        const position: PositionData = this.world.getComponent(entity, CT.Position);

        if (!cameraControl.isDragging) {
          return;
        }

        const deltaMove = {
          x: event.clientX - cameraControl.previousMousePosition.x,
          y: event.clientY - cameraControl.previousMousePosition.y
        };

        const rotationSpeed = 0.001;

        this.world.query_system
          .contains([CT.Player])
          .each((playerEntity: number) => {

            const playerPosition: PositionData = this.world.getComponent(playerEntity, CT.Position);
            const vec = new Vector3(playerPosition.x, playerPosition.y, playerPosition.z);

            const cameraEntity = entity;
            const cameraRotation: RotationData = this.world.getComponent(cameraEntity, CT.Rotation);
            const cameraPosition: PositionData = this.world.getComponent(cameraEntity, CT.Position);

            cameraRotation.y += deltaMove.x * rotationSpeed;

            const radius = 5; // Distância da câmera ao player
            const theta = cameraRotation.y;

            cameraPosition.x = playerPosition.x + radius * Math.sin(theta);
            cameraPosition.z = playerPosition.z + radius * Math.cos(theta);
            cameraPosition.y = playerPosition.y + 2; // Altura fixa da câmera em relação ao player

            const eventCall: EventCall<GameEvent, PositionData> = {
              type: GameEvent.CameraUpdate,
              data: vec
            }
            this.world.registerEvent(eventCall)
          });

        cameraControl.previousMousePosition = { x: event.clientX, y: event.clientY };
      });
  }


  start(world: ECS): void {
    this.world = world;
  }

  process(_world: ECS): void {
    // No need to process anything here, as the event listeners handle the updates
  }

  destroy(_: ECS): void { }
}

