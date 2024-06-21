import { ComponentType, GameEvent, GameMode } from "./enums";

//Counters
var counter_entity: number = 1;
var counter_component: number = 1;
var counter_system: number = 0;

//ComponentDataTypes 
export type PositionData = { x: number, y: number, z: number }

export class ECS {
	//Entity_ComponentType -> Component
	ect: Record<number, number> = [];
	cte: Record<number, number[]> = []
	ct: Record<number, any> = [];
	entities: Record<number, number[]> = [];
	components: Record<number, any> = [];

	e_ct: Record<number, number[]> = [];

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

	// Query : Todos os componentes e seu valores a partir de um ComponentTye
	queryComponentByType<T>(ct: ComponentType): T[] {
		const result: T[] = [];
		const entities = this.cte[ct] || [];

		entities.forEach(entity_id => {
			const key = `${entity_id}${ct}`;
			const component_id = this.ect[parseInt(key)];
			result.push(this.components[component_id]);
		});

		return result;
	}

	queryComponentByCtFromEntities(entities: number[], ct: ComponentType): any[] {
		const components = []
		for (const id of entities) {
			const key = parseInt(`${id}${ct}`)
			// components.push(this.components[this.ect[key]])
			components.push(this.ect[key])
		}
		return components;
	}



	queryEntitiesByCtGroup(cts: ComponentType[]): any[] {
		if (cts.length === 1) { return this.cte[cts[0]] }

		const groups: number[][] = cts.map(ct => this.cte[ct] || []);
		const pass: number[] = []
		const entityCount: Record<number, number> = [];

		groups.forEach(group => {
			group.forEach(entity_id => {
				if (entityCount[entity_id] === undefined) {
					entityCount[entity_id] = 0;
				}
				entityCount[entity_id]++;
			});
		});

		const requiredCount = cts.length;

		Object.keys(entityCount).forEach(entity_id => {
			if (entityCount[parseInt(entity_id)] === requiredCount) {
				let containsAll = true;

				for (const ct of cts) {
					if (!this.e_ct[parseInt(entity_id)].includes(ct)) {
						containsAll = false;
						break;
					}
				}

				if (containsAll) {
					pass.push(parseInt(entity_id));
				}
			}
		}); return pass;
	}
}

//System
interface ISystem {
	game_mode: GameMode;
	events: GameEvent[];
	start(w: ECS): void;
	process(w: ECS): void;
	destroy(w: ECS): void;
}

export class MovementSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.Movement, GameEvent.Keyboard];

	start(w: ECS): void { return }

	process(w: ECS): void {
		const entities = w.queryEntitiesByCtGroup([
			ComponentType.Position,
			ComponentType.Direction,
			ComponentType.Player,
			ComponentType.Movable,
		])
		const position = w.queryComponentByCtFromEntities(entities, ComponentType.Position)

		for (let p of position) {
			const data: PositionData = w.components[p];
			const new_position: PositionData = {
				x: 30,
				y: data.y + 10,
				z: data.z + 10
			}
			w.components[p] = new_position;
		}

	}

	destroy(w: ECS): void { return }

}


export class PlayerMovementSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.Movement];

	start(w: ECS): void { return }

	process(w: ECS): void {
		const player: number = w.queryEntitiesByCtGroup([
			ComponentType.Player,
			// ComponentType.Enemy,
			// ComponentType.Name,
			// ComponentType.Health,
			// ComponentType.Movable,
		])[0]
		const key = parseInt(`${player}${ComponentType.Position}`)
		const position: PositionData = w.components[w.ect[key]]
		if (!position) { return }
		w.components[w.ect[key]] = {
			x: position.x + 10,
			y: position.y + 10,
			z: position.z + 10,
		};
	}

	destroy(w: ECS): void { return }

}