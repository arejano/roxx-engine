var counter_entity: number = 1;
var counter_component: number = 1;
var counter_system: number = 1;

export class ECS {
	query_system: Query;
	pool_event: EventManager<number> = new EventManager<number>();

	game_mode: number | null = null;
	tick_mode: number | null = null;

	actual_mode: number | null = null;

	//Entity_ComponentType -> Component
	ect: Record<number, number> = [];
	cte: Record<number, number[]> = []
	ct: Record<number, any> = [];
	entities: Record<number, number[]> = [];
	components: Record<number, any> = [];

	e_ct: Record<number, number[]> = [];

	systems: Record<number, ISystem> = [];
	ge_systems: Record<number, number[]> = [];

	constructor() {
		this.query_system = new Query(this);
	}

	setGameMode(gm: number) {
		this.game_mode = gm;
		this.actual_mode = this.game_mode;
	}

	setTickMode(tm: number) {
		this.tick_mode = tm;
	}

	registerEvent(event: EventCall<number, any>) {
		this.pool_event.register(event);
	}

	update(dt: number) {
		//Nao fazer update se nao temos entidade
		if (Object.keys(this.entities).length === 0) { return }

		if (!this.game_mode) { return }
		//Run Systems by Event
		while (this.pool_event.hasEvents()) {
			const event = this.pool_event.next();
			const key = parseInt(`${this.game_mode}${event?.type}`)

			if (this.ge_systems[key]) {
				const systems = Object.values(this.ge_systems[key])

				for (const system of systems) {
					this.systems[system].process(this, dt, event)
				}
			}
		}

		//Run Tick Systems
		const tick_key = parseInt(`${this.actual_mode}${this.tick_mode}`)
		if (!this.ge_systems[tick_key]) {
			console.log("NULL - RenderSystem")
			return
		} else {

			for (const system of this.ge_systems[tick_key]) {
				if (this.systems[system]) {
					this.systems[system].process(this, dt)
				} else {
					console.log("SystemError")
				}
			}
		}
	}

	addEntity(components: { type: number, data: any }[]): number {
		const entity_id = counter_entity++;
		this.entities[entity_id] = [];

		components.forEach((c) => {
			const component_id = counter_component++;
			this.components[component_id] = Object.assign({}, c.data);
			this.registerComponent(entity_id, c.type, component_id)
		});
		return entity_id;
	}

	addComponentToEntity(entity_id: number, components: { type: number, data: any }[]): number {
		components.forEach((c) => {
			const component_id = counter_component++;
			this.components[component_id] = Object.assign({}, c.data);
			this.registerComponent(entity_id, c.type, component_id)
		});
		return entity_id;
	}

	addSystem(system: ISystem) {
		const system_id = counter_system++;

		for (const se of system.events) {
			const key = parseInt(`${system.game_mode}${se}`)
			if (!this.ge_systems[key]) {
				this.ge_systems[key] = []
			}
			this.ge_systems[key].push(system_id)
		}

		this.systems[system_id] = system;
		system.start(this)
	}

	registerComponent(entity_id: number, ct: number, component_id: number) {
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
export interface ISystem {
	game_mode: number;
	events: number[];
	start(w: ECS): void;
	process(w: ECS, dt: number, event?: any): void;
	destroy(w: ECS): void;
}


export type EventCall<T, D> = {
	type: T,
	data: D;
}

//EventManager
export class EventManager<T> {
	queue: EventCall<T, any>[] = [];

	next(): EventCall<T, any> | undefined {
		return this.queue.shift();
	}

	hasEvents(): boolean {
		return this.queue.length !== 0;
	}

	register(event: EventCall<T, any>) {
		this.queue.push(event);
	}
}

//Query
export class Query {
	world: ECS;

	entities: any[] = []
	data: any[] = []

	filter_contains: number[] = []
	filter_not_contains: number[] = []
	filter_component: number = 0;

	constructor(w: ECS) {
		this.world = w;
	}

	contains(ct: number[] | number) {
		if (Array.isArray(ct)) {
			this.filter_contains = ct;
		} else {
			this.filter_contains.push(ct)
		}
		return this;
	}

	not_contains(ct: number[] | number) {
		if (Array.isArray(ct)) {
			this.filter_not_contains = ct;
		} else {
			this.filter_not_contains.push(ct)
		}
		return this;
	}

	get_component(ct: number) {
		this.filter_component = ct;
		return this;
	}

	each(fn: Function) {
		this.run();
		for (const entity of this.entities) {
			fn(entity)
		}
	}

	get_entities(): number[] {
		this.run();
		return this.entities;
	}

	run() {
		this.entities = this.queryEntitiesByCtGroup(this.filter_contains)
	}

	queryComponentByType<T>(ct: number): T[] {
		const result: T[] = [];
		const entities = this.world.cte[ct] || [];

		entities.forEach(entity_id => {
			const key = `${entity_id}${ct}`;
			const component_id = this.world.ect[parseInt(key)];
			result.push(this.world.components[component_id]);
		});

		return result;
	}

	queryEntitiesByCtGroup(cts: number[]): any[] {
		if (cts.length === 1) { return this.world.cte[cts[0]] }

		const groups: number[][] = cts.map(ct => this.world.cte[ct] || []);
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
					if (!this.world.e_ct[parseInt(entity_id)].includes(ct)) {
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

	queryComponentByCtFromEntities(entities: number[], ct: number): any[] {
		const components = []
		for (const id of entities) {
			const key = parseInt(`${id}${ct}`)
			components.push(this.world.ect[key])
		}
		return components;
	}
}
