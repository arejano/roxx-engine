import { BodyData, CameraData, CanvasData, PositionData, RenderableData, RotationData, SpeedData } from "../ecs/components_data";
import { ECS, EventCall, ISystem } from "../ecs/ecs";
import * as THREE from 'three';

export class PlayerMovementSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [GameEvent.Keyboard];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS, dt: number, event: EventCall<GameEvent.Keyboard, MovementDirection>): void {
		w.query_system
			.contains([
				ComponentType.Player
			])
			.each((id: number) => {
				const speed_key = parseInt(`${id}${ComponentType.Speed}`)
				const speed: SpeedData = w.components[w.ect[speed_key]];

				const key = parseInt(`${id}${ComponentType.Position}`)
				const position: PositionData = w.components[w.ect[key]]

				if (!position && !speed) { return }

				switch (event.data) {
					case MovementDirection.Up:
						position.z += -speed.speed * dt
						break;
					case MovementDirection.Down:
						position.z += speed.speed * dt
						break;
					case MovementDirection.Left:
						position.x += -speed.speed * dt
						break;
					case MovementDirection.Right:
						position.x += speed.speed * dt
						break;
					case MovementDirection.UpLeft:
					case MovementDirection.UpRight:
					case MovementDirection.DownLeft:
					case MovementDirection.DownRight:
				}
			})
	}
}



export class DebugSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running, GameMode.Pause];
	events: GameEvent[] = [GameEvent.Tick];

	start(w: ECS): void {
		// console.log(w)
		// console.log(w.ge_systems)
		// console.log(w.systems)
	}
	destroy(_: ECS): void { }

	process(_w: ECS, _dt: number, _event: EventCall<GameEvent.Keyboard, MovementDirection>): void {
	}
}



export class KeySystem {
	keyDownHandlers: { [key: string]: () => void } = {}
	keyUpHandlers: { [key: string]: () => void } = {}

	onKeyDownEvent(event: KeyboardEvent) {
		const handler = this.keyDownHandlers[event.key];
		if (handler) {
			handler();
		}
	}
	onKeyUpEvent(event: KeyboardEvent) {
		const handler = this.keyUpHandlers[event.key];
		if (handler) {
			handler();
		}
	}
	public onKeyDown(key: string, handler: () => void) {
		this.keyDownHandlers[key] = handler;
	}
	public onKeyUp(key: string, handler: () => void) {
		this.keyUpHandlers[key] = handler;
	}
}


export class KeyboardSystem extends KeySystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [];

	move_keys: { key: string, direction: MovementDirection }[] = [
		// { key: 'ArrowUp', direction: MovementDirection.Up },
		// { key: 'ArrowDown', direction: MovementDirection.Down },
		{ key: 'ArrowLeft', direction: MovementDirection.Left },
		{ key: 'ArrowRight', direction: MovementDirection.Right },
		{ key: 'w', direction: MovementDirection.Up },
		{ key: 'a', direction: MovementDirection.Left },
		{ key: 's', direction: MovementDirection.Down },
		{ key: 'd', direction: MovementDirection.Right },
		//Jump
		{ key: ' ', direction: MovementDirection.Up },
	]


	menu_keys: { key: string, event: GameKeyboardEvent }[] = [
		{ key: 'p', event: GameKeyboardEvent.Pause },
		{ key: 'P', event: GameKeyboardEvent.Pause }
	]

	start(w: ECS): void {
		window.addEventListener('keydown', this.onKeyDownEvent.bind(this))
		window.addEventListener('keyup', this.onKeyUpEvent.bind(this))

		for (const key of this.move_keys) {
			this.onKeyDown(key.key, () => {
				const eventCall: EventCall<GameEvent.Keyboard, MovementDirection> = {
					type: GameEvent.Keyboard,
					data: key.direction
				}
				w.registerEvent(eventCall)
			});
		}

		for (const key of this.menu_keys) {
			this.onKeyDown(key.key, () => {
				const eventCall: EventCall<GameEvent.MenuKeyboard, GameKeyboardEvent> = {
					type: GameEvent.MenuKeyboard,
					data: key.event
				}
				w.registerEvent(eventCall)
			});
		}
	}

	destroy(_: ECS): void { }

	process(_: ECS): void { }
}


export class GameKeyboardSystem extends KeySystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running, GameMode.Pause];
	events: GameEvent[] = [GameEvent.MenuKeyboard];


	constructor() {
		super()
	}
	start(_w: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS, _dt: number, _event: EventCall<GameEvent.Keyboard, GameKeyboardEvent>): void {
		console.log("Change Game Mode via System")
		if (w.game_mode == GameMode.Running) {
			w.game_mode = GameMode.Pause
		} else {
			w.game_mode = GameMode.Running
		}
	}
}

export class EnemyMovementSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [GameEvent.EnemyKeyboard];

	start(_: ECS): void { }
	destroy(_: ECS): void { }

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Enemy
			])
			.each((id: number) => {
				const key = parseInt(`${id}${ComponentType.Position}`)
				const position: PositionData = w.components[w.ect[key]]
				if (!position) { return }
				w.components[w.ect[key]] = {
					x: position.x + 1,
					y: position.y + 1,
					z: position.z + 1,
				};
			})
	}
}

export class THREEJSRenderSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [GameEvent.Tick];

	resolutions = {
		small: { w: 800, h: 600 },
		developer: { w: 1366, h: 768 },
		release: { w: 1920, h: 1080 }
	}

	width: number = 960
	height: number = 500
	aspect: number = this.width / this.height
	D: number = 1

	// camera: THREE.PerspectiveCamera;

	camera: THREE.OrthographicCamera;

	canvas: HTMLCanvasElement;
	renderer: THREE.WebGLRenderer;
	scene: THREE.Scene

	canvasId: string = "gameCanvas";
	world: ECS;

	start(w: ECS): void {
		this.world = w;

		window.addEventListener('resize', () => {
			this.updateCanvasSize();
		});

		this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.scene = new THREE.Scene();

		w.query_system
			.contains([ComponentType.Camera])
			.each((entity: number) => {
				const camera: CameraData = this.world.getComponent(entity, ComponentType.Camera)
				const cameraPosition: PositionData = this.world.getComponent(entity, ComponentType.Position);
				console.log(camera)
				this.camera = new THREE.OrthographicCamera(
					-camera.D * this.aspect,
					camera.D * this.aspect,
					camera.D,
					-camera.D,
					1,
					1000,
				)
				this.camera.zoom = camera.zoom;
				this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

				this.camera.lookAt(this.scene.position)
				const rotation: RotationData = this.world.getComponent(entity, ComponentType.Rotation)
				rotation.x = this.camera.rotation.x;
				rotation.y = this.camera.rotation.y;
				rotation.z = this.camera.rotation.z;
			})

		w.query_system
			.contains([ComponentType.Renderable])
			.each((entity: number) => {
				const renderable: RenderableData = this.world.getComponent(entity, ComponentType.Renderable)

				if (!renderable.mesh) {
					renderable.mesh = new THREE.Mesh(renderable.geometry, renderable.material);
				}

				this.scene.add(renderable.mesh);
			})

		this.scene.add(new THREE.AmbientLight(0xFFFFFF))

		const light = new THREE.PointLight(0xffffff, 1, 100)
		light.position.set(10, 30, 15);
		this.scene.add(light)

	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	updateCamera() {

	}

	updateCanvasSize() {
		this.world.query_system
			.contains([ComponentType.Canvas])
			.each((entity: number) => {
				const canvas: CanvasData = this.world.getComponent(entity, ComponentType.Canvas)
				canvas.h = window.innerHeight;
				canvas.w = window.innerWidth;
				this.renderer.setSize(canvas.w, canvas.h);
			})

	}

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Camera
			])
			.each((entity: number) => {
				const camera: CameraData = this.world.getComponent(entity, ComponentType.Camera)
				const position: PositionData = this.world.getComponent(entity, ComponentType.Position)
				const rotation: RotationData = this.world.getComponent(entity, ComponentType.Rotation)
				this.camera.near = camera.near;
				this.camera.far = camera.far;
				this.camera.zoom = camera.zoom;
				this.camera.rotation.z = rotation.z;
				this.camera.rotation.y = rotation.y;
				this.camera.rotation.z = rotation.z;
				this.camera.updateProjectionMatrix()
			})

		// Atualize a posição dos objetos renderizáveis
		w.query_system
			.contains([ComponentType.Renderable, ComponentType.Position])
			.each((entity: number) => {

				const renderable = this.world.getComponent(entity, ComponentType.Renderable)
				const position: PositionData = this.world.getComponent(entity, ComponentType.Position)

				if (renderable && position && renderable.mesh) {
					renderable.mesh.position.set(position.x, position.y, position.z);
				}
			});

		this.render();
	}

	destroy(_: ECS): void { }
}

export enum ComponentType {
	DontUse,
	Player,
	Enemy,
	Name,
	Camera,
	Health,

	Bullet,
	Movable,

	//Render
	Renderable,

	//EntityStatus ?
	Invisible,


	//Velocity + Movement
	Speed,
	Direction,

	//Transforms
	Position,
	Rotation,
	Orientation,
	Scale,
	Body,
	Colision,

	//Controller
	PlayerController,
	AIController,

	//Canvas	
	Canvas,


	//World Physics Blocks
	Floor,


	//Develop
	Developer,
	CameraControl,
}

export enum MovementDirection {
	Up,
	Down,
	Left,
	Right,
	UpLeft,
	UpRight,
	DownLeft,
	DownRight
}

export enum GameKeyboardEvent {
	Pause,
}

export enum GameMode {
	DontUse,
	Menu,
	Running,
	Pause,
}




export enum GameEvent {
	DontUse,
	Tick,
	Movement,
	Keyboard,
	MenuKeyboard,
	EnemyKeyboard,
	CameraZoom,
	CameraMouse
}

