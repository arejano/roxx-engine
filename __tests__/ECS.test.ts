import { ECS, MovementSystem, PlayerMovementSystem, PositionData } from "../src/ecs";
import { ComponentType } from "../src/enums";

jest.useFakeTimers();

describe('World', () => {
	var ecs = new ECS();
	var player = undefined;
	var enemy = undefined;

	var qt_random: number = 10;

	var global_query: any = undefined;

	var query_many: { [key: number]: number[] };

	const player_move_system = new PlayerMovementSystem();

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

		for (let i = 0; i < qt_random; i++) {
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

	it('QueryComponentsByType', () => {
		const query: PositionData[] = ecs.queryComponentByType<PositionData>(ComponentType.Position);
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
		expect(ecs).toBeInstanceOf(ECS);
	});


	it("Update Counters", () => {
		log_table.qt_entidades = Object.keys(ecs.entities).length;
		log_table.qt_componentes = Object.keys(ecs.components).length;
		log_table.qt_tipos_componentes = Object.keys(ecs.ct).length
		log_table.qt_entity_ct_to_components = Object.keys(ecs.ect).length
		expect(ecs).toBeInstanceOf(ECS);
	})


	// it("TestSystem", () => {
	// 	// const mv = new MovementSystem();
	// 	// console.log(query)
	// 	// mv.process(ecs);
	// 	// const query: PositionData[] = ecs.queryComponentByType<PositionData>(ComponentType.Position);
	// 	// console.log(query)
	// 	expect(ecs).toBeInstanceOf(ECS);
	// })


	it("PlayerMovementSystem", () => {
		player_move_system.process(ecs);
		player_move_system.process(ecs);
		player_move_system.process(ecs);
		player_move_system.process(ecs);
		player_move_system.process(ecs);
		player_move_system.process(ecs);
		expect(ecs).toBeInstanceOf(ECS);
	})

	it("UpdateGlobalQuery", () => {
		global_query = ecs.queryComponentByType<PositionData>(ComponentType.Position)
			.slice(0, 2);
		expect(ecs).toBeInstanceOf(ECS);
	})


	it('Console', () => {
		// console.table(log_table)
		// console.log(global_query)
	});
})

