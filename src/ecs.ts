import { ComponentType, GameEvent, GameMode } from "./enums";
import { Query } from "./query";

//Counters
var counter_entity: number = 1;
var counter_component: number = 1;
var counter_system: number = 0;

//ComponentDataTypes 
export type PositionData = { x: number, y: number, z: number }

export class ECS<GM, GE> {
	//All query in one place
	query_system: Query;

	game_mode: GM | null = null;

	//Entity_ComponentType -> Component
	ect: Record<number, number> = [];
	cte: Record<number, number[]> = []
	ct: Record<number, any> = [];
	entities: Record<number, number[]> = [];
	components: Record<number, any> = [];

	e_ct: Record<number, number[]> = [];

	//Precisa de GameMode e GameEvent para o cadastro dos sistemas
	systems: Record<number, ISystem<GM, GE>> = [];
	ge_systems: Record<number, number[]> = [];

	pool_event: EventManager<GE> = new EventManager<GE>();


	constructor() {
		this.query_system = new Query(this);
	}

	setGameMode(gm: GM) {
		this.game_mode = gm;
	}

	registerEvent(event: EventCall<GE>) {
		this.pool_event.register(event);
	}

	update() {
		if (!this.game_mode) { return }
		if (this.pool_event.hasEvents()) {
			const event = this.pool_event.next();
			const key = parseInt(`${this.game_mode}${event}`)
			console.log(key)
			console.log(Object.values(this.ge_systems))
			console.log(Object.keys(this.ge_systems))
			console.log(this.systems)

			// for (const system in Object.values(this.ge_systems[key])) {
				// console.log(system)
				// this.systems[system].process(this)
			// }
		}
	}

	addEntity(components: { type: ComponentType, data: any }[]): number {
		const entity_id = counter_entity++;
		this.entities[entity_id] = [];

		components.forEach((c) => {
			const component_id = counter_component++;
			this.components[component_id] = Object.assign({}, c.data);
			this.registerComponent(entity_id, c.type, component_id)
		});
		return entity_id;
	}

	addSystem(system: ISystem<GM, GE>) {
		const system_id = counter_system++;

		for (const se in system.events) {
			const key = parseInt(`${system.game_mode}${se}`)
			if (!this.ge_systems[key]) {
				this.ge_systems[key] = []
			}
			this.ge_systems[key].push(system_id)
		}

		this.systems[system_id] = system;
	}

	registerComponent(entity_id: number, ct: ComponentType, component_id: number) {
		//Update: Entity -> Component[]
		this.add(this.entities[entity_id], component_id)

		if (!this.e_ct[entity_id]) { this.e_ct[entity_id] = [] }
		this.add(this.e_ct[entity_id], ct)

		//Update: ComponentType -> Component[]
		if (!this.ct[ct]) { this.ct[ct] = [] }
		this.add(this.ct[ct], component_id)

		//Udate ComponentType -> Entity[]
		if (!this.cte[ct]) { this.cte[ct] = [] }
		this.add(this.cte[ct], entity_id)

		//Update Entity+ComponentTye -> Component
		const key = parseInt(`${entity_id}${ct}`)
		this.ect[key] = component_id
	}

	add(list: number[], item: number) {
		if (!list.includes(item)) {
			list.push(item)
		}
	}
}

//System
interface ISystem<G, E> {
	game_mode: G;
	events: E[];
	start(w: ECS<G, E>): void;
	process(w: ECS<G, E>): void;
	destroy(w: ECS<G, E>): void;
}

export class PlayerMovementSystem implements ISystem<GameMode, GameEvent> {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.Keyboard, GameEvent.Movement];

	start(_: ECS<GameMode, GameEvent>): void { }
	destroy(_: ECS<GameMode, GameEvent>): void { }

	process(w: ECS<GameMode, GameEvent>): void {
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

export type EventCall<T> = {
	type: T,
	data: any;
}

//EventManager
export class EventManager<T> {
	events: T[] = [];

	next(): T | undefined {
		return this.events.pop();
	}

	hasEvents(): boolean {
		return this.events.length !== 0;
	}

	register(event: EventCall<T>) {
		this.events.push(event.type);
	}
}