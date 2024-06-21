export class Clock {
	private lastTime: number;
	private deltaTime: number;

	constructor() {
		this.lastTime = Date.now();
		this.deltaTime = 0;
	}

	update(): void {
		const currentTime = Date.now();
		this.deltaTime = (currentTime - this.lastTime) / 1000; 
		this.lastTime = currentTime;
	}

	getDeltaTime(): number {
		return this.deltaTime;
	}
}
