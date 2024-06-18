var counter_entity: number = 1;
var counter_component: number = 1;

export enum ComponentType {
	DontUsee,
	Position,
	Renderable,
	Camera,
	Colision
}

type ComponentRegister = {
	type: ComponentType,
	data: any
}

export class ECS {

	entities: Record<number, number> = [];
	entities_by_component: Record<number, Array<number>> = [];
	components: Record<number, any> = [];
	components_by_type: Record<number, any> = [];

	//Entity_ComponentType
	ect: Record<number, Array<number>> = [];

	//ComponentType_Length
	ctl: Record<number, number> = [];

	//ComponentType_Group -> Entity
	ctge: Record<number, Array<number>> = [];

	constructor() {
	}

	addEntity(
		components: Array<ComponentRegister>
	) {
		const new_entity = counter_entity++;
		this.entities[new_entity] = new_entity;

		components.forEach((c) => {
			const component_id = counter_component++;
			this.components[component_id] = Object.assign({}, c.data);
			this.registerComponent(new_entity, c.type, component_id)
		});
	}

	registerComponent(
		entity: number,
		ct: ComponentType,
		id: number
	) {
		if (this.entities_by_component[id]) {
			this.entities_by_component[id].push(entity);
		} else {
			this.entities_by_component[id] = [entity]
		}

		if (this.components_by_type[ct]) {
			this.components_by_type[ct].push(id);
		} else {
			this.components_by_type[ct] = [id]
		}

		//Atualizar ComponentTypeLength
		if (this.components_by_type[ct]) {
			this.ctl[ct] = this.components_by_type[ct].length;
		}
		//Atualizar Entity -> ComponentType[]
		if (!this.ect[entity]) { this.ect[entity] = [] }
		this.ect[entity].push(ct)

		// console.log("ect",this.ect)

		//Atualizar  CTGE
		const ctge_key = parseInt(this.ect[entity].join(''));
		if (!this.ctge[ctge_key]) { this.ctge[ctge_key] = [] }
		this.ctge[ctge_key].push(entity)

	}

	queryByComponentType(ct: ComponentType): Array<any> {
		return this.components_by_type[ct]
			.map((id: number) => {
				return this.components[id]
			})
	}

	//TODO: Refatorar para validar o tipo de retorno, valoe o QueryResult??
	queryByCtList(types: Array<ComponentType>): number[] {
		const key = parseInt(types.join(''))
		return this.ctge[key] ? this.ctge[key] : this.ect[key] ?? null;
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
