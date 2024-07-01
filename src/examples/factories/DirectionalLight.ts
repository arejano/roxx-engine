import { ComponentType } from "../enums/ComponentType";

export const lights = [
	[
		{ type: ComponentType.Position, data: { x: -5, y: 4, z: -2 } },
		{
			type: ComponentType.DirectionalLight, data: {
				shadow: {
					mapSize: { width: 1024, height: 1024 },
					camera_near: 0.5,
					camera_far: 500
				},
				castShadow: true,
				color: 0xFFFFFF,
				intensity: 1,
			}
		},
	],
	[
		{ type: ComponentType.Position, data: { x: 5, y: 4, z: -2 } },
		{
			type: ComponentType.DirectionalLight, data: {
				shadow: {
					mapSize: { width: 1024, height: 1024 },
					camera_near: 0.5,
					camera_far: 500
				},
				castShadow: true,
				color: 0xFFFF00,
				intensity: 1,
			}
		},
	]
]
