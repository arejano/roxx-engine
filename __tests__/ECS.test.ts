import { ComponentType, ECS } from "../src/ecs";

describe('ECS', () => {
})

describe('World', () => {
	var ecs = new ECS();
	var player = undefined;
	var enemy = undefined;

	ecs.addEntity([
		{ type: ComponentType.Name, data: { name: "Francisco" } },
		{ type: ComponentType.Player, data: true },
		{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
		{ type: ComponentType.Renderable, data: { active: true } },
		{ type: ComponentType.Colision, data: { active: true } },
	])



	it('Start ECS', () => {
		ecs = new ECS();
		expect(ecs).toBeInstanceOf(ECS);
	});

	it("Create Entity", () => {
		player = ecs.addEntity([
			{ type: ComponentType.Name, data: { name: "Gustavo" } },
			{ type: ComponentType.Player, data: true },
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
			{ type: ComponentType.Renderable, data: { active: true } },
			{ type: ComponentType.Colision, data: { active: true } },
		])

		enemy = ecs.addEntity([
			{ type: ComponentType.Name, data: { name: "Jorge" } },
			{ type: ComponentType.Enemy, data: true },
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
			{ type: ComponentType.Renderable, data: { active: true } },
			{ type: ComponentType.Colision, data: { active: true } },
		])


		expect(player).toBeGreaterThan(0);
	})

	type PositionData = { id: number, data: { x: number, y: number, z: number } }
	type NameData = { id: number, data: { name: string } }

	it('Query Components By ComponentType', () => {
		const query: PositionData[] = ecs.queryComponentByType(ComponentType.Position);
		console.log(query)
		query.forEach((data: PositionData) => {
			data.data.z += 1
		})
		console.log(query)

		const names: NameData[] = ecs.queryComponentByType(ComponentType.Name);
		console.log(names)
		names.forEach((n: any) => {
			// console.log(n.data.name)
			if (n.data.name == "Gustavo") {
				n.data.name = "Gustavo Arejano"
			}
		})
		console.log(names)

		expect(ecs).toBeInstanceOf(ECS);
	});


	it("Query player Entity", () => {
		// const query = ecs.queryEntitiesByComponentType(ComponentType.Player);
		// console.log(ecs.entities)
		// console.log(Object.keys(ecs.entities_by_ctype))
		// console.log(Object.values(ecs.entities_by_ctype))
		// console.log(query)
		// console.log(Object.keys(ecs.ect))
		// console.log(Object.values(ecs.ect))
	})

	it('Mock', () => {

		// const components = [
		// ]


		// const components_2 = [
		// 	{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
		// ]

		// ecs.addEntity(components)
		// ecs.addEntity(components_2)
		// ecs.addEntity(components)
		// ecs.addEntity(components_2)
		// ecs.addEntity(components)
		// ecs.addEntity(components_2)
		// ecs.addEntity(components)


		// type PositionData = { x: number, z: number, y: number };
		// type RenderableData = {active:boolean}

		// const query: Array<PositionData> = ecs.queryByComponentType(ComponentType.Position)
		// const query_renderable: Array<RenderableData> = ecs.queryByComponentType(ComponentType.Renderable);

		// query.forEach((d) => {
		// 	d.x = d.x + Math.random();
		// })


		// const query_entity = ecs.queryByCtList([
		// 	ComponentType.Position,
		// 	ComponentType.Renderable,
		// 	ComponentType.Colision
		// ])

		// const query_render = ecs.queryByCtList([ComponentType.Renderable]);

		// query_renderable.forEach((r) => {
		// console.log(r.active)
		// })

		// console.log(query)
		// console.log(query_renderable)

		expect(ecs).toBeInstanceOf(ECS);
	});
})

