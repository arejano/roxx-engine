import { ECS, MovementSystem } from "../src/ecs";
import { ComponentType } from "../src/enums";

describe('World', () => {
	var ecs = new ECS();
	var player = undefined;
	var enemy = undefined;

	var query_many: { [key: number]: number[] };

	var log_table = {
		qt_entidades: 0,
		qt_componentes: 0,
		qt_tipos_componentes: 0,
		qt_entity_ct_to_components: 0,
		qt_position_entity: 0,
		qt_query_many: 0
	}

	it('Start ECS', () => {
		ecs = new ECS();
		expect(ecs).toBeInstanceOf(ECS);
	});

	it("Create Entity", () => {
		player = ecs.addEntity([
			{ type: ComponentType.Name, data: { name: "Brutus - Player" } },
			{ type: ComponentType.Direction, data: { direction: 0 } },
			{ type: ComponentType.Player, data: true },
			{ type: ComponentType.Movable, data: true },
			{ type: ComponentType.Health, data: { life: 100 } },
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
			{ type: ComponentType.Renderable, data: { active: true } },
			{ type: ComponentType.Colision, data: { active: true } },
		])

		enemy = ecs.addEntity([
			{ type: ComponentType.Name, data: { name: "Brauliu - Enemy" } },
			{ type: ComponentType.Direction, data: { direction: 0 } },
			{ type: ComponentType.Enemy, data: true },
			{ type: ComponentType.Movable, data: true },
			{ type: ComponentType.Health, data: { life: 100 } },
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
			{ type: ComponentType.Renderable, data: { active: true } },
			{ type: ComponentType.Colision, data: { active: true } },
		])

		for (let i = 0; i < 15000; i++) {
			ecs.addEntity([
				{ type: ComponentType.Bullet, data: true },
				{ type: ComponentType.Direction, data: { direction: 0 } },
				{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
				{ type: ComponentType.Renderable, data: { active: true } },
				{ type: ComponentType.Colision, data: { active: true } },
			])

		}
		expect(player).toBeGreaterThan(0);
		expect(enemy).toBeGreaterThan(0);
	})

	type PositionData = { id: number, data: { x: number, y: number, z: number } }

	it('QueryComponentsByType', () => {
		const query: PositionData[] = ecs.queryComponentByType(ComponentType.Position);
		log_table.qt_position_entity = query.length;
		expect(ecs).toBeInstanceOf(ECS);
	});

	it('QueryEntitiesByCtGroup', () => {
		query_many = ecs.queryEntitiesByCtGroup([
			ComponentType.Player,
			ComponentType.Position,
			ComponentType.Bullet,
			ComponentType.Renderable,
		]);

		log_table.qt_query_many = Object.keys(query_many).length
	});


	it("Update Counters", () => {
		log_table.qt_entidades = Object.keys(ecs.entities).length;
		log_table.qt_componentes = Object.keys(ecs.components).length;
		log_table.qt_tipos_componentes = Object.keys(ecs.ct).length
		log_table.qt_entity_ct_to_components = Object.keys(ecs.ect).length
	})


	it("TestSystem", () => {
		const mv = new MovementSystem();
		mv.process(ecs);
	})

	it('Console', () => {
		console.table(log_table)
	});
})

