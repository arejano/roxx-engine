export enum ComponentType {
	DontUse,
	Player,
	Enemy,
	Name,
	Position,
	Renderable,
	Camera,
	Colision,
	Health,
	Bullet,
	Movable,
	Direction,
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
}
