
var counter_entity: number = 1;
var counter_component: number = 1;

export enum ComponentType {
	DontUsee,
	Name,
	Position,
	Renderable,
	Camera,
	Colision,
	Player,
	Enemy,
	Health
}

type ComponentRegister = {
	type: ComponentType,
	data: any
}

export class ECS {

	entities: Record<number, number[]> = [];
	entities_by_ctype: Record<number, number[]> = []
	entities_by_component: Record<number, number[]> = [];
	components: Record<number, any> = [];
	cte: Record<number, number[]> = []
	ct: Record<number, any> = [];

	//Entity_ComponentType -> Component
	ect: Record<number, number> = [];

	// //ComponentType_Length
	// ctl: Record<number, number> = [];

	// //ComponentType_Group -> Entity
	// ctge: Record<number, Array<number>> = [];

	constructor() {
	}

	addEntity(
		components: ComponentRegister[]
	): number {
		const new_entity = counter_entity++;
		this.entities[new_entity] = [];

		components.forEach((c) => {
			const component_id = counter_component++;
			this.components[component_id] = Object.assign({}, c.data);
			this.registerComponent(new_entity, c.type, component_id)
		});
		return new_entity;
	}

	registerComponent(
		entity_id: number,
		ct: ComponentType,
		component_id: number
	) {
		//Update: Entity -> Component[]
		this.add(this.entities[entity_id], component_id)


		//Update: ComponentType -> Component[]
		if(!this.ct[ct]){this.ct[ct] = []}
		this.add(this.ct[ct], component_id)

		//Udate ComponentType -> Entity[]
		if(!this.cte[ct]){this.cte[ct] = []}
		this.add(this.cte[ct], entity_id)

		//Update Entity+ComponentTye -> Component
		const key = parseInt(`${entity_id}${ct}`)
		this.ect[key] = component_id

		// if (this.entities_by_component[id]) {
		// 	this.entities_by_component[id].push(entity);
		// } else {
		// 	this.entities_by_component[id] = [entity]
		// }

		// if (this.components_by_type[ct]) {
		// 	this.components_by_type[ct].push(id);
		// } else {
		// 	this.components_by_type[ct] = [id]
		// }

		// //Atualizar ComponentTypeLength
		// if (this.components_by_type[ct]) {
		// 	this.ctl[ct] = this.components_by_type[ct].length;
		// }

		// //Atualizar Entity -> ComponentType[]
		// if (!this.ect[entity]) { this.ect[entity] = [] }
		// this.ect[entity].push(ct)

		// //Atualizar ComponentType -> Entity[]
		// if (!this.entities_by_ctype[ct]) { this.entities_by_ctype[ct] = [entity] }
		// else { this.entities_by_ctype[ct].push(entity) }

		// //Atualizar  CTGE
		// const ctge_key = parseInt(this.ect[entity].join(''));
		// if (!this.ctge[ctge_key]) { this.ctge[ctge_key] = [] }
		// this.ctge[ctge_key].push(entity)

	}

	add(list: number[], item: number) {
		if (!list.includes(item)) {
			list.push(item)
		}
	}

	queryByComponentType(ct: ComponentType): Array<any> {
		return this.ct[ct]
			.map((id: number) => {
				return this.components[id]
			})
	}

	// //TODO: Refatorar para validar o tipo de retorno, valoe o QueryResult??
	// queryByCtList(types: Array<ComponentType>): number[] {
	// 	const key = parseInt(types.join(''))
	// 	return this.ctge[key] ? this.ctge[key] : this.ect[key] ?? null;
	// }

	queryEntitiesByComponentType(ct: ComponentType): number[] {
		return this.entities_by_ctype[ct];
	}
}

export class Component {
	data: any;
	id: number;

	constructor(d: any) {
		this.data = d;
		this.id = counter_component++;
	}
}
