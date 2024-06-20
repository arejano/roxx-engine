import { ECS } from "../src/ecs";
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
			{ type: ComponentType.Name, data: { name: "Gustavo" } },
			{ type: ComponentType.Player, data: true },
			{ type: ComponentType.Health, data: { life: 100 } },
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
			{ type: ComponentType.Renderable, data: { active: true } },
			{ type: ComponentType.Colision, data: { active: true } },
		])

		enemy = ecs.addEntity([
			{ type: ComponentType.Name, data: { name: "Jorge" } },
			{ type: ComponentType.Enemy, data: true },
			{ type: ComponentType.Health, data: { life: 100 } },
			{ type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
			{ type: ComponentType.Renderable, data: { active: true } },
			{ type: ComponentType.Colision, data: { active: true } },
		])

		for (let i = 0; i < 500; i++) {
			ecs.addEntity([
				{ type: ComponentType.Bullet, data: true },
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
		query.forEach((data: PositionData) => {
			data.data.z += 1
		})
		log_table.qt_position_entity = query.length;

		expect(ecs).toBeInstanceOf(ECS);
	});

	it('QueryEntitiesByCtGroup', () => {
		query_many = ecs.queryEntitiesByCtGroup([
			// ComponentType.Name,
			ComponentType.Player,
			ComponentType.Position,
			// ComponentType.Health,
			ComponentType.Bullet,
			ComponentType.Renderable,
			// ComponentType.Enemy,
		]);

		log_table.qt_query_many = Object.keys(query_many).length
	});



	it("Update Counters", () => {
		log_table.qt_entidades = Object.keys(ecs.entities).length;
		log_table.qt_componentes = Object.keys(ecs.components).length;
		log_table.qt_tipos_componentes = Object.keys(ecs.ct).length
		log_table.qt_entity_ct_to_components = Object.keys(ecs.ect).length
	})

	it('Console', () => {
		console.table(log_table)
	});
})

