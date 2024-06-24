import { ECS } from "./ecs";
import { ComponentType } from "./enums"

export class Query {
	world: ECS<any, any>;

	entities: any[] = []
	data: any[] = []

	filter_contains: ComponentType[] = []
	filter_not_contains: ComponentType[] = []
	filter_component: ComponentType = 0;

	constructor(w: ECS<any, any>) {
		this.world = w;
	}

	contains(ct: ComponentType[] | ComponentType) {
		if (Array.isArray(ct)) {
			this.filter_contains = ct;
		} else {
			this.filter_contains.push(ct)
		}
		return this;
	}

	not_contains(ct: ComponentType[] | ComponentType) {
		if (Array.isArray(ct)) {
			this.filter_not_contains = ct;
		} else {
			this.filter_not_contains.push(ct)
		}
		return this;
	}

	get_component(ct: ComponentType) {
		this.filter_component = ct;
		return this;
	}

	each(fn: Function) {
		this.run();
		for (const entity of this.entities) {
			fn(entity)
		}
	}

	run() {
		this.entities = this.queryEntitiesByCtGroup(this.filter_contains)
	}

	//Query In World
	queryComponentByType<T>(ct: ComponentType): T[] {
		const result: T[] = [];
		const entities = this.world.cte[ct] || [];

		entities.forEach(entity_id => {
			const key = `${entity_id}${ct}`;
			const component_id = this.world.ect[parseInt(key)];
			result.push(this.world.components[component_id]);
		});

		return result;
	}

	queryEntitiesByCtGroup(cts: ComponentType[]): any[] {
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

	queryComponentByCtFromEntities(entities: number[], ct: ComponentType): any[] {
		const components = []
		for (const id of entities) {
			const key = parseInt(`${id}${ct}`)
			// components.push(this.components[this.ect[key]])
			components.push(this.world.ect[key])
		}
		return components;
	}
}
