import { CameraData, RotationData } from "../ecs/components_data";
import { ECS, EventCall, ISystem } from "../ecs/ecs";
import { ComponentType, GameEvent, GameMode } from "./game_demo";

export class Camera3DZoomSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [GameEvent.CameraZoom];

	start(w: ECS): void {
		window.addEventListener("wheel", (event: WheelEvent) => {
			const eventCall: EventCall<GameEvent, number> = {
				type: GameEvent.CameraZoom,
				data: event.deltaY
			}
			w.registerEvent(eventCall)
		})
	}

	destroy(_: ECS): void { }

	process(w: ECS, _: any, event: EventCall<GameEvent, number>): void {
		const zoom: boolean = event.data < 0 ? true : false;
		w.query_system
			.contains([
				ComponentType.Camera
			])
			.each((entity: number) => {
				const camera_key = parseInt(`${entity}${ComponentType.Camera}`)
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
			.contains([ComponentType.CameraControl])
			.each((entity: number) => {
				const cameraControlKey = parseInt(`${entity}${ComponentType.CameraControl}`);
				const cameraControl: CameraControlData = this.world.components[this.world.ect[cameraControlKey]];
				cameraControl.isDragging = true;
				cameraControl.previousMousePosition = { x: event.clientX, y: event.clientY };
			});
	}

	onMouseUp(event: MouseEvent) {
		this.world.query_system
			.contains([ComponentType.CameraControl])
			.each((entity: number) => {
				const cameraControlKey = parseInt(`${entity}${ComponentType.CameraControl}`);
				const cameraControl: CameraControlData = this.world.components[this.world.ect[cameraControlKey]];
				cameraControl.isDragging = false;
			});
	}

	onMouseMove(event: MouseEvent) {
		this.world.query_system
			.contains([ComponentType.Camera, ComponentType.CameraControl])
			.each((entity: number) => {
				const cameraControlKey = parseInt(`${entity}${ComponentType.CameraControl}`);
				const cameraControl: CameraControlData = this.world.components[this.world.ect[cameraControlKey]];

				if (!cameraControl.isDragging) {
					return;
				}

				const deltaMove = {
					x: event.clientX - cameraControl.previousMousePosition.x,
					y: event.clientY - cameraControl.previousMousePosition.y
				};

				const rotation: RotationData = this.world.getComponent(entity, ComponentType.Rotation)


				const rotationSpeed = 0.001;
				rotation.y += deltaMove.x * rotationSpeed;
				rotation.x += deltaMove.y * rotationSpeed;

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





// export class RenderSystem2D implements ISystem {
// 	game_mode: GameMode[] = [GameMode.Running];
// 	events: GameEvent[] = [GameEvent.Tick];

// 	resolutions = {
// 		small: { w: 800, h: 600 },
// 		developer: { w: 1366, h: 768 },
// 		release: { w: 1920, h: 1080 }
// 	}

// 	private ctx: CanvasRenderingContext2D | null = null;

// 	start(w: ECS): void {
// 		window.addEventListener('resize', () => {
// 			this.updateCanvasSize(w);
// 		});

// 		w.query_system
// 			.contains([ComponentType.Canvas])
// 			.each((entity: number) => {

// 				const canvas_key = parseInt(`${entity}${ComponentType.Canvas}`)
// 				const canvas_component: CanvasData = w.components[w.ect[canvas_key]]

// 				const canvas = document.createElement('canvas');
// 				canvas.width = canvas_component.w
// 				canvas.height = canvas_component.h
// 				this.ctx = canvas.getContext('2d');

// 				if (this.ctx) {
// 					document.body.appendChild(this.ctx.canvas)
// 				}

// 			})
// 	}

// 	updateCanvasSize(w: ECS) {
// 		w.query_system
// 			.contains([ComponentType.Canvas])
// 			.each((entity: number) => {
// 				console.log("Atualizando o resize da camera")

// 				// const canvas_key = parseInt(`${entity}${ComponentType.Canvas}`)
// 				// const canvas_component: CanvasData = w.components[w.ect[canvas_key]]

// 				// const canvas = document.createElement('canvas');
// 				// canvas.width = canvas_component.w
// 				// canvas.height = canvas_component.h
// 				// this.ctx = canvas.getContext('2d');

// 				// if (this.ctx) {
// 				// 	document.body.appendChild(this.ctx.canvas)
// 				// }

// 			})
// 	}

// 	process(w: ECS): void {
// 		w.query_system
// 			.contains([
// 				ComponentType.Canvas
// 			])
// 			.each((entity: number) => {

// 				const canvas_key = parseInt(`${entity}${ComponentType.Canvas}`)
// 				const canvas_component: CanvasData = w.components[w.ect[canvas_key]]

// 				if (this.ctx) {
// 					this.ctx.clearRect(0, 0, canvas_component.w, canvas_component.h);
// 					this.ctx.fillStyle = canvas_component.fillColor;
// 					this.ctx.fillRect(0, 0, canvas_component.w, canvas_component.h);
// 				}
// 			})

// 		w.query_system
// 			.contains([
// 				ComponentType.Renderable
// 			])
// 			.each((entity: number) => {
// 				const position_key = parseInt(`${entity}${ComponentType.Position}`)
// 				const position: PositionData = w.components[w.ect[position_key]]

// 				const body_key = parseInt(`${entity}${ComponentType.Body}`)
// 				const body: BodyData = w.components[w.ect[body_key]]

// 				if (this.ctx && position && body) {
// 					this.ctx.fillStyle = body.color;
// 					this.ctx.fillRect(position.x, position.y, body.w, body.h);
// 				}
// 			})
// 	}

// 	destroy(_: ECS): void { }
// }

