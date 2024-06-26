import { ECS, EventCall } from "../src/ecs";
import { ComponentType, EnemyMovementSystem, GameEvent, GameMode, LogSystem, PlayerMovementSystem, PositionData, RegisterInvisible, RenderSystem } from "../src/game_demo";

jest.useFakeTimers();

describe('World', () => {
	var ecs = new ECS();
	var player: number = 0;
	var enemy = undefined;

	var qt_random: number = 1;
	var global_query: any = undefined;
	var query_many: { [key: number]: number[] };

	var loop_counter = 1;
	var loop_max_counter = 4;

	var log_table = {
		qt_entidades: 0,
		qt_componentes: 0,
		qt_tipos_componentes: 0,
		qt_entity_ct_to_components: 0,
		qt_position_entity: 0,
		qt_query_many: 0,
		qt_systems: 0,
		qt_ge_systems: 0,
		loops: loop_counter,
	}

	it('Start ECS', () => {
		ecs.addSystem(new PlayerMovementSystem())
		ecs.addSystem(new EnemyMovementSystem())
		ecs.addSystem(new RenderSystem())
		// ecs.addSystem(new LogSystem())
		// ecs.addSystem(new RegisterInvisible())
		ecs.setGameMode(GameMode.Running);
		ecs.setTickMode(GameEvent.Tick);
		expect(ecs).toBeInstanceOf(ECS);
	});


	it('Register Event', () => {
		const eventCall: EventCall<GameEvent.Keyboard> = {
			type: GameEvent.Keyboard,
			data: null
		}
		ecs.registerEvent(eventCall)
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
		const query: PositionData[] = ecs.query_system.queryComponentByType<PositionData>(ComponentType.Position);
		log_table.qt_position_entity = query.length;
		expect(ecs).toBeInstanceOf(ECS);
	});

	it('QueryEntitiesByCtGroup', () => {
		query_many = ecs.query_system.queryEntitiesByCtGroup([
			ComponentType.Player,
			ComponentType.Position,
			ComponentType.Bullet,
			ComponentType.Renderable,
		]);

		log_table.qt_query_many = Object.keys(query_many).length
		expect(ecs).toBeInstanceOf(ECS);
	});

	it("Add Invisible to Player", () => {
		ecs.addComponentToEntity(player, [
			{ type: ComponentType.Invisible, data: { active: true } },
		])
	})

	it("Add Keyboard Event", () => {
		const eventCall: EventCall<GameEvent.Keyboard> = {
			type: GameEvent.Keyboard,
			data: null
		}

		const enemyEventMove: EventCall<GameEvent.EnemyKeyboard> = {
			type: GameEvent.EnemyKeyboard,
			data: null
		}
		ecs.registerEvent(eventCall)
		ecs.registerEvent(enemyEventMove)
		ecs.registerEvent(enemyEventMove)
		ecs.registerEvent(enemyEventMove)

		while (loop_counter <= loop_max_counter) {
			ecs.registerEvent(eventCall)
			loop_counter++;
		}

		loop_counter = 0;

	})

	it("World Loop", () => {
		while (loop_counter <= loop_max_counter) {
			ecs.update()
			loop_counter++;
		}
		expect(ecs).toBeInstanceOf(ECS);
	})

	it("UpdateGlobalQuery", () => {
		global_query = ecs.query_system.queryComponentByType<PositionData>(ComponentType.Position)
			.slice(0, 2);
		expect(ecs).toBeInstanceOf(ECS);
	})



	it("Update Counters", () => {
		log_table.qt_entidades = Object.keys(ecs.entities).length;
		log_table.qt_componentes = Object.keys(ecs.components).length;
		log_table.qt_tipos_componentes = Object.keys(ecs.ct).length
		log_table.qt_entity_ct_to_components = Object.keys(ecs.ect).length
		log_table.loops = loop_counter;
		log_table.qt_systems = Object.keys(ecs.systems).length;
		log_table.qt_ge_systems = Object.keys(ecs.ge_systems).length;
		expect(ecs).toBeInstanceOf(ECS);
	})

	it('Console', () => {
		// console.table(log_table)
		console.log(global_query)
		// console.log(ecs.pool_event.events)
	});
})

