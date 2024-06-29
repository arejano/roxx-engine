import * as THREE from 'three';
import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";
import { ComponentType as CT } from '../enums/ComponentType';
import { CameraData, CanvasData, PositionData, RenderableData, RotationData } from '../../ecs/components_data';

export class RenderSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [GameEvent.Tick, GameEvent.CameraUpdate];

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

	camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;

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
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio)

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFShadowMap;


		this.scene = new THREE.Scene();

		w.query_system
			.contains([CT.Camera])
			.each((entity: number) => {
				const camera: CameraData = this.world.getComponent(entity, CT.Camera)
				const cameraPosition: PositionData = this.world.getComponent(entity, CT.Position);
				camera.aspect = window.innerWidth / window.innerHeight

				// this.camera = new THREE.OrthographicCamera(
				// 	-camera.D * this.aspect,
				// 	camera.D * this.aspect,
				// 	camera.D,
				// 	-camera.D,
				// 	1,
				// 	1000,
				// )

				this.camera = new THREE.PerspectiveCamera(
					camera.fov,
					camera.aspect,
					camera.near,
					camera.far
				)

				this.camera.zoom = camera.zoom;
				this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

				this.camera.lookAt(this.scene.position)
				const rotation: RotationData = this.world.getComponent(entity, CT.Rotation)
				rotation.x = this.camera.rotation.x;
				rotation.y = this.camera.rotation.y;
				rotation.z = this.camera.rotation.z;
			})

		w.query_system
			.contains([CT.Renderable])
			.each((entity: number) => {
				const renderable: RenderableData = this.world.getComponent(entity, CT.Renderable)

				if (!renderable.mesh) {
					renderable.mesh = new THREE.Mesh(renderable.geometry, renderable.material);
				}

				this.scene.add(renderable.mesh);
			})



		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(-5, 4, -2);
		directionalLight.castShadow = true;

		directionalLight.shadow.mapSize.width = 1024;
		directionalLight.shadow.mapSize.height = 1024;
		directionalLight.shadow.camera.near = 0.5;
		directionalLight.shadow.camera.far = 500;
		this.scene.add(directionalLight);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	updateCamera() {

	}

	cameraLookAt(position: any) {
		console.log(position)
		console.log(this.scene.position)
		this.camera.lookAt(position);
	}

	updateCanvasSize() {
		this.world.query_system
			.contains([CT.Canvas])
			.each((entity: number) => {
				const canvas: CanvasData = this.world.getComponent(entity, CT.Canvas)
				canvas.h = window.innerHeight;
				canvas.w = window.innerWidth;
				this.renderer.setSize(canvas.w, canvas.h);
			})

	}

	process(w: ECS, _dt: number, event: EventCall<GameEvent, PositionData>): void {
		if (event.type === GameEvent.CameraUpdate) {
			console.log(event)
			this.cameraLookAt(event.data);
		}
		w.query_system
			.contains([
				CT.Camera
			])
			.each((entity: number) => {
				const camera: CameraData = this.world.getComponent(entity, CT.Camera)
				const position: PositionData = this.world.getComponent(entity, CT.Position)
				const rotation: RotationData = this.world.getComponent(entity, CT.Rotation)
				this.camera.near = camera.near;
				this.camera.far = camera.far;
				this.camera.zoom = camera.zoom;
				this.camera.rotation.z = rotation.z;
				this.camera.rotation.y = rotation.y;
				this.camera.rotation.z = rotation.z;
				this.camera.position.set(position.x, position.y, position.x)
				this.camera.updateProjectionMatrix()
			})

		// Atualize a posição dos objetos renderizáveis
		w.query_system
			.contains([CT.Renderable, CT.Position])
			.each((entity: number) => {

				const renderable = this.world.getComponent(entity, CT.Renderable)
				const position: PositionData = this.world.getComponent(entity, CT.Position)

				if (renderable && position && renderable.mesh) {
					renderable.mesh.position.set(position.x, position.y, position.z);
				}
			});

		this.render();
	}

	destroy(_: ECS): void { }
}

