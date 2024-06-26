import { BodyData, CameraData, CanvasData, PositionData, SpeedData } from "../ecs/components_data";
import { ECS, EventCall, ISystem } from "../ecs/ecs";
import * as THREE from 'three';

export class PlayerMovementSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
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
						w.components[w.ect[key]].y = w.components[w.ect[key]].y += -speed.speed * dt
						break;
					case MovementDirection.Down:
						w.components[w.ect[key]].y = w.components[w.ect[key]].y += speed.speed * dt
						break;
					case MovementDirection.Left:
						w.components[w.ect[key]].x = w.components[w.ect[key]].x += -speed.speed * dt
						break;
					case MovementDirection.Right:
						w.components[w.ect[key]].x = w.components[w.ect[key]].x += speed.speed * dt
						break;
					case MovementDirection.UpLeft:
					case MovementDirection.UpRight:
					case MovementDirection.DownLeft:
					case MovementDirection.DownRight:
				}
			})
	}
}

export class KeyboardSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [];

	private keyDownHandlers: { [key: string]: () => void } = {}
	private keyUpHandlers: { [key: string]: () => void } = {}

	move_keys: { key: string, direction: MovementDirection }[] = [
		// { key: 'ArrowUp', direction: MovementDirection.Up },
		// { key: 'ArrowDown', direction: MovementDirection.Down },
		{ key: 'ArrowLeft', direction: MovementDirection.Left },
		{ key: 'ArrowRight', direction: MovementDirection.Right },
		// { key: 'w', direction: MovementDirection.Up },
		{ key: 'a', direction: MovementDirection.Left },
		// { key: 's', direction: MovementDirection.Down },
		{ key: 'd', direction: MovementDirection.Right },
		//Jump
		{ key: ' ', direction: MovementDirection.Up },
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
	}

	private onKeyDownEvent(event: KeyboardEvent) {
		const handler = this.keyDownHandlers[event.key];
		if (handler) {
			handler();
		}
	}

	private onKeyUpEvent(event: KeyboardEvent) {
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

	destroy(_: ECS): void { }

	process(_: ECS): void { }
}


export class EnemyMovementSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
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


export class RenderSystem2D implements ISystem {
	game_mode: GameMode = GameMode.Running;
	events: GameEvent[] = [GameEvent.Tick];

	resolutions = {
		small: { w: 800, h: 600 },
		developer: { w: 1366, h: 768 },
		release: { w: 1920, h: 1080 }
	}

	private ctx: CanvasRenderingContext2D | null = null;

	start(w: ECS): void {
		window.addEventListener('resize', () => {
			this.updateCanvasSize(w);
		});

		w.query_system
			.contains([ComponentType.Canvas])
			.each((entity: number) => {

				const canvas_key = parseInt(`${entity}${ComponentType.Canvas}`)
				const canvas_component: CanvasData = w.components[w.ect[canvas_key]]

				const canvas = document.createElement('canvas');
				canvas.width = canvas_component.w
				canvas.height = canvas_component.h
				this.ctx = canvas.getContext('2d');

				if (this.ctx) {
					document.body.appendChild(this.ctx.canvas)
				}

			})
	}

	updateCanvasSize(w: ECS) {
		w.query_system
			.contains([ComponentType.Canvas])
			.each((entity: number) => {
				console.log("Atualizando o resize da camera")

				// const canvas_key = parseInt(`${entity}${ComponentType.Canvas}`)
				// const canvas_component: CanvasData = w.components[w.ect[canvas_key]]

				// const canvas = document.createElement('canvas');
				// canvas.width = canvas_component.w
				// canvas.height = canvas_component.h
				// this.ctx = canvas.getContext('2d');

				// if (this.ctx) {
				// 	document.body.appendChild(this.ctx.canvas)
				// }

			})
	}

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Canvas
			])
			.each((entity: number) => {

				const canvas_key = parseInt(`${entity}${ComponentType.Canvas}`)
				const canvas_component: CanvasData = w.components[w.ect[canvas_key]]

				if (this.ctx) {
					this.ctx.clearRect(0, 0, canvas_component.w, canvas_component.h);
					this.ctx.fillStyle = canvas_component.fillColor;
					this.ctx.fillRect(0, 0, canvas_component.w, canvas_component.h);
				}
			})

		w.query_system
			.contains([
				ComponentType.Renderable
			])
			.each((entity: number) => {
				const position_key = parseInt(`${entity}${ComponentType.Position}`)
				const position: PositionData = w.components[w.ect[position_key]]

				const body_key = parseInt(`${entity}${ComponentType.Body}`)
				const body: BodyData = w.components[w.ect[body_key]]

				if (this.ctx && position && body) {
					this.ctx.fillStyle = body.color;
					this.ctx.fillRect(position.x, position.y, body.w, body.h);
				}
			})
	}

	destroy(_: ECS): void { }
}


export class THREEJSRenderSystem implements ISystem {
	game_mode: GameMode = GameMode.Running;
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

	start(w: ECS): void {
		window.addEventListener('resize', () => {
			this.updateCanvasSize(w);
		});

		this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.scene = new THREE.Scene();

		w.query_system
			.contains([ComponentType.Camera])
			.each((entity: number) => {
				const camera_key = parseInt(`${entity}${ComponentType.Camera}`)
				const camera: CameraData = w.components[w.ect[camera_key]]
				this.camera = new THREE.OrthographicCamera(
					-camera.D * this.aspect,
					camera.D * this.aspect,
					camera.D,
					-camera.D,
					1,
					1000,
				)
				this.camera.zoom = camera.zoom;
			})

		const geometry = new THREE.BoxGeometry(0.32, 0.64, 0.10)

		// const material = new THREE.MeshPhongMaterial({
		// 	color: 0xFFFFFF,
		// 	// specular: 0xffffff,
		// 	// shininess: 100,
		// });

		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material)
		this.scene.add(cube)

		this.scene.add(new THREE.AmbientLight(0xFFFFFF))

		const light = new THREE.PointLight(0xffffff, 1, 100)
		light.position.set(10, 30, 15);
		this.scene.add(light)

		this.camera.position.set(20, 20, 20)
		this.camera.lookAt(this.scene.position)
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	updateCamera() {

	}

	updateCanvasSize(_: ECS) {
		// w.query_system
		// 	.contains([ComponentType.Canvas])
		// 	.each((_: number) => {
		// 		console.log("Atualizando o resize da camera")
		// 	})
	}

	process(w: ECS): void {
		w.query_system
			.contains([
				ComponentType.Camera
			])
			.each((entity: number) => {
				const camera_key = parseInt(`${entity}${ComponentType.Camera}`)
				const camera: CameraData = w.components[w.ect[camera_key]]
				this.camera.near = camera.near;
				this.camera.far = camera.far;
				this.camera.zoom = camera.zoom;
				this.camera.updateProjectionMatrix()
			})


		w.query_system
			.contains([
				ComponentType.Renderable
			])
			.each((_: number) => {
				// console.log(entity)
				// const position_key = parseInt(`${entity}${ComponentType.Position}`)
				// const position: PositionData = w.components[w.ect[position_key]]

				// const body_key = parseInt(`${entity}${ComponentType.Body}`)
				// const body: BodyData = w.components[w.ect[body_key]]

				// if (this.ctx && position && body) {
				// 	this.ctx.fillStyle = body.color;
				// 	this.ctx.fillRect(position.x, position.y, body.w, body.h);
				// }
			})
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
	Developer
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
	EnemyKeyboard,
	CameraZoom
}
