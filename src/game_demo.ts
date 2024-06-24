import { ECS, ISystem } from "./ecs";

export type PositionData = { x: number, y: number, z: number }
export class PlayerMovementSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.Keyboard];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Player
			])
			.each((id: number) => {
				const key = parseInt(`${id}${ComponentType.Position}`)
				const position: PositionData = w.components[w.ect[key]]
				if (!position) { return }
				w.components[w.ect[key]] = {
					x: position.x + 1,
					y: position.y + 1,
					z: position.z + 1,
				};
			})
	}
}


export class EnemyMovementSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.EnemyKeyboard];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Enemy
			])
			.each((id: number) => {
				const key = parseInt(`${id}${ComponentType.Position}`)
				const position: PositionData = w.components[w.ect[key]]
				if (!position) { return }
				w.components[w.ect[key]] = {
					x: position.x + 1,
					y: position.y + 1,
					z: position.z + 1,
				};
			})
	}
}

export class RenderSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(_: ECS): void {
		console.log(`Render`)
	}
}

export class LogSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.Tick];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Name
			])
			.each((entity: number) => {
				const key = parseInt(`${entity}${ComponentType.Name}`)
				// console.log(`name`,entity, w.components[w.ect[key]].name)
			})
	}
}


export class RegisterInvisible implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.Tick];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Invisible
			])
			.each((entity: number) => {
				// console.log(`entidade`, entity)
				const key = parseInt(`${entity}${ComponentType.Invisible}`)
				const comp = w.components[w.ect[key]]
				w.components[w.ect[key]].active = false;
				// console.log(`invisible data`, comp)
			})
	}
}

export enum ComponentType {
	DontUse,
	Player,
	Enemy,
	Name,
	Position,
	Renderable,
	Camera,
	Colision,
	Health,
	Bullet,
	Movable,
	Direction,
	Invisible
}

export enum GameMode {
	DontUse,
	Menu,
	Running,
	Pause,
}

export enum GameEvent {
	DontUse,
	Tick,
	Movement,
	Keyboard,
	EnemyKeyboard,
}
