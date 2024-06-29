import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";
import { GameKeyboardEvent } from "../enums/KeyboardEvent";
import { MovementDirection } from "../enums/MovementDirection";

export class KeySystem {
	keyDownHandlers: { [key: string]: () => void } = {}
	keyUpHandlers: { [key: string]: () => void } = {}

	onKeyDownEvent(event: KeyboardEvent) {
		const handler = this.keyDownHandlers[event.key];
		if (handler) {
			handler();
		}
	}
	onKeyUpEvent(event: KeyboardEvent) {
		const handler = this.keyUpHandlers[event.key];
		if (handler) {
			handler();
		}
	}
	public onKeyDown(key: string, handler: () => void) {
		this.keyDownHandlers[key] = handler;
	}
	public onKeyUp(key: string, handler: () => void) {
		this.keyUpHandlers[key] = handler;
	}
}


export class KeyboardSystem extends KeySystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [];

	move_keys: { key: string, direction: MovementDirection }[] = [
		{ key: 'ArrowUp', direction: MovementDirection.Up },
		{ key: 'ArrowDown', direction: MovementDirection.Down},
		{ key: 'ArrowLeft', direction: MovementDirection.Left},
		{ key: 'ArrowRight', direction: MovementDirection.Right },
		{ key: 'w', direction: MovementDirection.Up },
		{ key: 'a', direction: MovementDirection.Left },
		{ key: 's', direction: MovementDirection.Down },
		{ key: 'd', direction: MovementDirection.Right },
		// { key: ' ', direction: MovementDirection.Up },
	]

	action_keys: { key: string, event: GameKeyboardEvent }[] = [
		{ key: 'p', event: GameKeyboardEvent.Pause },
		{ key: 'P', event: GameKeyboardEvent.Pause }
	]


	menu_keys: { key: string, event: GameKeyboardEvent }[] = [
		{ key: 'p', event: GameKeyboardEvent.Pause },
		{ key: 'P', event: GameKeyboardEvent.Pause }
	]

	start(w: ECS): void {
		window.addEventListener('keydown', this.onKeyDownEvent.bind(this))
		window.addEventListener('keyup', this.onKeyUpEvent.bind(this))

		for (const key of this.move_keys) {
			this.onKeyDown(key.key, () => {
				const eventCall: EventCall<GameEvent.Keyboard, MovementDirection> = {
					type: GameEvent.Keyboard,
					data: key.direction
				}
				w.registerEvent(eventCall)
			});
		}

		for (const key of this.menu_keys) {
			this.onKeyDown(key.key, () => {
				const eventCall: EventCall<GameEvent.MenuKeyboard, GameKeyboardEvent> = {
					type: GameEvent.MenuKeyboard,
					data: key.event
				}
				w.registerEvent(eventCall)
			});
		}
	}

	destroy(_: ECS): void { }

	process(_: ECS): void { }
}


export class GameKeyboardSystem extends KeySystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running, GameMode.Pause];
	events: GameEvent[] = [GameEvent.MenuKeyboard];

	constructor() {
		super()
	}
	start(_w: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS, _dt: number, _event: EventCall<GameEvent.Keyboard, GameKeyboardEvent>): void {
		console.log("Change Game Mode via System")
		if (w.game_mode == GameMode.Running) {
			w.game_mode = GameMode.Pause
		} else {
			w.game_mode = GameMode.Running
		}
	}
}

