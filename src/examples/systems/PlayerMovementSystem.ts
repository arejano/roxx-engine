import { PositionData, SpeedData } from "../../ecs/components_data";
import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { ComponentType } from "../enums/ComponentType";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";
import { MovementDirection } from "../enums/MovementDirection";

export class PlayerMovementSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [GameEvent.Keyboard];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS, dt: number, event: EventCall<GameEvent.Keyboard, MovementDirection>): void {
		w.query_system
			.contains([
				ComponentType.Player
			])
			.each((id: number) => {
				const speed_key = parseInt(`${id}${ComponentType.Speed}`)
				const speed: SpeedData = w.components[w.ect[speed_key]];

				const key = parseInt(`${id}${ComponentType.Position}`)
				const position: PositionData = w.components[w.ect[key]]

				if (!position && !speed) { return }

				switch (event.data) {
					case MovementDirection.Up:
						position.z += -speed.speed * dt
						break;
					case MovementDirection.Down:
						position.z += speed.speed * dt
						break;
					case MovementDirection.Left:
						position.x += -speed.speed * dt
						break;
					case MovementDirection.Right:
						position.x += speed.speed * dt
						break;
					case MovementDirection.UpLeft:
					case MovementDirection.UpRight:
					case MovementDirection.DownLeft:
					case MovementDirection.DownRight:
				}
			})
	}
}
