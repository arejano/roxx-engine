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
	//Entity_ComponentType -> Component
	ect: Record<number, number> = [];
	cte: Record<number, number[]> = []
	ct: Record<number, any> = [];
	entities: Record<number, number[]> = [];
	components: Record<number, any> = [];

	constructor() { }

	addEntity(
		components: ComponentRegister[]
	): number {
		const entity_id = counter_entity++;
		this.entities[entity_id] = [];

		components.forEach((c) => {
			const component_id = counter_component++;
			this.components[component_id] = Object.assign({}, c.data);
			this.registerComponent(entity_id, c.type, component_id)
		});
		return entity_id;
	}

	registerComponent(
		entity_id: number,
		ct: ComponentType,
		component_id: number
	) {
		//Update: Entity -> Component[]
		this.add(this.entities[entity_id], component_id)


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
		var result: { id: number, data: any }[] = []
		this.cte[ct].map((entity_id) => {
			const key = parseInt(`${entity_id}${ct}`)
			const component_id = this.ect[key];
			result.push({
				id: component_id,
				data: this.components[component_id]
			})
		})
		return result;
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
