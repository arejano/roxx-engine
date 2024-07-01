import * as THREE from 'three';
import { ECS, EventCall, ISystem } from "../../ecs/ecs";
import { GameEvent } from "../enums/GameEvent";
import { GameMode } from "../enums/GameMode";
import { ComponentType as CT } from '../enums/ComponentType';
import { CameraData, CanvasData, DirectionalLightData, PositionData, RenderableData, RotationData } from '../../ecs/components_data';
import { CameraType } from '../enums/CameraType';

export type RenderConfig = {
	cameraType: CameraType,
}

export class RenderSystem implements ISystem {
	game_mode: GameMode[] = [GameMode.Running];
	events: GameEvent[] = [GameEvent.Tick, GameEvent.CameraUpdate];

	resolutions = {
		nintendo: { w: 256, h: 240 },
		nintendo64: { w: 640, h: 480 },
		ps1: { w: 320, h: 240 },
		small: { w: 800, h: 600 },
		developer: { w: 1366, h: 768 },
		release: { w: 1920, h: 1080 }
	}

	config: RenderConfig = {
		cameraType: CameraType.Orthograpgic
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

	camera_is_up: boolean = false;

	start(w: ECS): void {
		this.world = w;

		window.addEventListener('resize', () => {
			this.updateRenderSize();
		});

		this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio)

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFShadowMap;

		this.scene = new THREE.Scene();

		this.startCamera();

		// Iniciar todos os renderizaveis
		this.startRenderable();

		//Iniciar todas as Luzes
		this.startLights();

		// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		// directionalLight.position.set(-5, 4, -2);
		// directionalLight.castShadow = true;

		// directionalLight.shadow.mapSize.width = 1024;
		// directionalLight.shadow.mapSize.height = 1024;
		// directionalLight.shadow.camera.near = 0.5;
		// directionalLight.shadow.camera.far = 500;

		// this.scene.add(directionalLight);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	startLights() {
		//Ambient
		this.world.query_system
			.contains([CT.AmbientLight])
			.each(() => {

			})

		//Directional
		this.world.query_system
			.contains([CT.DirectionalLight])
			.each((id: number) => {
				const data: DirectionalLightData = this.world.getComponent(id, CT.DirectionalLight);
				const position: PositionData = this.world.getComponent(id, CT.Position);

				const light = new THREE.DirectionalLight(
					data.color,
					data.intensity
				);

				light.castShadow = data.castShadow;
				light.shadow.mapSize.width = data.shadow.mapSize.width;
				light.shadow.mapSize.height = data.shadow.mapSize.height;
				light.shadow.camera.near = data.shadow.camera_near;
				light.shadow.camera.far = data.shadow.camera_far;

				light.position.set(position.x, position.y, position.z);

				this.scene.add(light)
			})
	}

	//Camera
	startCamera() {
		this.world.query_system
			.contains([CT.Camera])
			.each((entity: number) => {
				//Validar que apenas uma Camera sera instanciada?
				if (!this.camera_is_up) {
					const camera: CameraData = this.world.getComponent(entity, CT.Camera)
					const cameraPosition: PositionData = this.world.getComponent(entity, CT.Position);
					camera.aspect = window.innerWidth / window.innerHeight

					if (this.config.cameraType == CameraType.Perspective) {
						this.newPerspectiveCamera(camera, cameraPosition);
					} else {
						this.newOrthographicCamera(camera, cameraPosition);
					}

					const rotation: RotationData = this.world.getComponent(entity, CT.Rotation)
					rotation.x = this.camera.rotation.x;
					rotation.y = this.camera.rotation.y;
					rotation.z = this.camera.rotation.z;
				}
			})
	}

	newPerspectiveCamera(camera: CameraData, _position: PositionData) {
		this.camera = new THREE.PerspectiveCamera(
			camera.fov,
			camera.aspect,
			camera.near,
			camera.far
		)
	}

	newOrthographicCamera(camera: CameraData, position: PositionData) {
		this.camera = new THREE.OrthographicCamera(
			-camera.D * this.aspect,
			camera.D * this.aspect,
			camera.D,
			-camera.D,
			camera.near,
			camera.far,
		)

		this.camera.zoom = camera.zoom;
		this.camera.position.set(position.x, position.y, position.z)

		this.camera.lookAt(this.scene.position)
	}

	updateCamera(
		camera: CameraData,
		position: PositionData,
		rotation: RotationData
	) {
		this.camera.near = camera.near;
		this.camera.far = camera.far;
		this.camera.zoom = camera.zoom;
		this.camera.rotation.z = rotation.z;
		this.camera.rotation.y = rotation.y;
		this.camera.rotation.z = rotation.z;
		this.camera.position.set(position.x, position.y, position.x)

		this.camera.updateProjectionMatrix()
	}

	cameraLookAt(position: any) {
		console.log(position)
		console.log(this.scene.position)
		this.camera.lookAt(position);
	}

	updateRenderSize() {
		this.world.query_system
			.contains([CT.Canvas])
			.each((entity: number) => {
				const canvas: CanvasData = this.world.getComponent(entity, CT.Canvas)
				canvas.h = window.innerHeight;
				canvas.w = window.innerWidth;
				this.renderer.setSize(canvas.w, canvas.h);
			})

		this.world.query_system
			.contains([CT.Camera])
			.each((entity: number) => {
				const camera: CameraData = this.world.getComponent(entity, CT.Camera)
				camera.aspect = window.innerWidth / window.innerHeight;
			})

	}

	process(w: ECS, _dt: number, event: EventCall<GameEvent, PositionData>): void {
		if (event.type === GameEvent.CameraUpdate) {
			console.log(event)
			this.cameraLookAt(event.data);
		}

		//Update Camera
		w.query_system
			.contains([
				CT.Camera
			])
			.each((entity: number) => {
				const camera: CameraData = this.world.getComponent(entity, CT.Camera)
				const position: PositionData = this.world.getComponent(entity, CT.Position)
				const rotation: RotationData = this.world.getComponent(entity, CT.Rotation)
				this.updateCamera(camera, position, rotation);
			})


		// Atualize a posição dos objetos renderizáveis
		this.updateRenderable();
		this.render();
	}

	//Renderable
	startRenderable() {
		this.world.query_system
			.contains([CT.Renderable])
			.each((entity: number) => {
				const renderable: RenderableData = this.world.getComponent(entity, CT.Renderable)
				if (renderable.mesh) {
					this.scene.add(renderable.mesh);
				}
			})

	}

	updateRenderable() {
		this.world.query_system
			.contains([CT.Renderable, CT.Position])
			.each((entity: number) => {

				const renderable = this.world.getComponent(entity, CT.Renderable)
				const position: PositionData = this.world.getComponent(entity, CT.Position)

				if (renderable && position && renderable.mesh) {
					renderable.mesh.position.set(position.x, position.y, position.z);
				}
			});


	}

	destroy(_: ECS): void { }
}

