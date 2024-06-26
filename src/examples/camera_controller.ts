import { CameraData } from "../ecs/components_data";
import { ECS, EventCall, ISystem } from "../ecs/ecs";
import { ComponentType, GameEvent, GameMode } from "./game_demo";

export class Camera3DZoomSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
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
