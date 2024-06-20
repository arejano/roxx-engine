import { ComponentType } from "./enums";
var counter_entity: number = 1;
var counter_component: number = 1;

export class ECS {
	//Entity_ComponentType -> Component
	ect: Record<number, number> = [];
	cte: Record<number, number[]> = []
	ct: Record<number, any> = [];
	entities: Record<number, number[]> = [];
	components: Record<number, any> = [];

	e_ct: Record<number, number[]> = [];

	addEntity(components: ComponentRegister[]): number {
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
	queryComponentByType(ct: ComponentType): { id: number, data: any }[] {
		const result: { id: number, data: any }[] = [];
		const entities = this.cte[ct] || [];  // Certifique-se de que entities não é undefined

		entities.forEach(entity_id => {
			const key = `${entity_id}${ct}`;
			const component_id = this.ect[parseInt(key)];
			result.push({
				id: component_id,
				data: this.components[component_id]
			});
		});

		return result;
	}

	queryGroup(cts: ComponentType[]): { [key: number]: number[] } {
		var queryGroups: any[] = []
		cts.forEach((ct) => {
			queryGroups.push(this.cte[ct])
		})

		return this.findCommonElements(queryGroups);
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

	findCommonElements(data: { [key: number]: number[] }): { [key: number]: number[] } {
		// Convert all arrays to sets for easy intersection operations
		const sets = Object.values(data).map(arr => new Set(arr));

		// Use the first set as the base for intersection
		const commonElements = [...sets[0]].filter(value =>
			sets.every(set => set.has(value))
		);

		// Create the result object with the common elements
		const result: { [key: number]: number[] } = {};
		for (const key in data) {
			result[key] = commonElements;
		}

		return result;
	}


}

type ComponentRegister = {
	type: ComponentType,
	data: any
}
