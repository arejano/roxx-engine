import { ECS } from "../ecs/ecs";

export class Engine {
	private lastTime: number;
	private deltaTime: number;
	private running: boolean;
	private ecs: ECS;

	constructor(ecs: ECS) {
		this.ecs = ecs;
		this.lastTime = 0;
		this.deltaTime = 0;
		this.running = false;
	}

	private update(time: number) {
		this.deltaTime = (time - this.lastTime) / 1000; // Converter para segundos
		this.lastTime = time;

		// Atualiza o ECS
		this.ecs.update(this.deltaTime);

		// Continuar o loop
		if (this.running) {
			requestAnimationFrame(this.update.bind(this));
		}
	}

	start() {
		this.running = true;
		this.lastTime = performance.now();
		requestAnimationFrame(this.update.bind(this));
	}

	stop() {
		this.running = false;
	}
}
