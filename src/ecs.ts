var counter_entity: number = 0;
var counter_component: number = 0;

export enum ComponentType {
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
	}

	queryByComponentType(ct: ComponentType): Array<any> {
		return this.components_by_type[ct]
			.map((id: number) => {
				return this.components[id]
			})
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
