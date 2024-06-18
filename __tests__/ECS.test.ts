import { ComponentType, ECS } from "../src/ecs";

describe('ECS', () => {
	it('Start ECS', () => {
		const ecs = new ECS();
		expect(ecs).toBeInstanceOf(ECS);
	});
})

describe('ECS', () => {
	it('Start ECS - With Entity', () => {
		const ecs = new ECS();

		const components = [
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
			{ type: ComponentType.Renderable, data: { active: true } },
			{ type: ComponentType.Colision, data: { active: true } },
		]


		const components_2 = [
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
		]

		// ecs.addEntity(components)
		// ecs.addEntity(components_2)
		// ecs.addEntity(components)
		// ecs.addEntity(components_2)
		// ecs.addEntity(components)
		// ecs.addEntity(components_2)
		// ecs.addEntity(components)


		type PositionData = { x: number, z: number, y: number };
		// type RenderableData = {active:boolean}

		// const query: Array<PositionData> = ecs.queryByComponentType(ComponentType.Position)
		// const query_renderable: Array<RenderableData> = ecs.queryByComponentType(ComponentType.Renderable);

		// query.forEach((d) => {
		// 	d.x = d.x + Math.random();
		// })

		console.log(ecs.ctge)

		const query_entity = ecs.queryByCtList([
			ComponentType.Position,
			ComponentType.Renderable,
			ComponentType.Colision
		])

		const query_render = ecs.queryByCtList([ComponentType.Renderable]);
		console.log(query_render)

		console.log(query_entity)


		// query_renderable.forEach((r) => {
		// console.log(r.active)
		// })

		// console.log(query)
		// console.log(query_renderable)

		expect(ecs).toBeInstanceOf(ECS);
	});
})

