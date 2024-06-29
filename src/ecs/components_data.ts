import * as THREE from 'three';

export type PositionData = { x: number, y: number, z: number }

export type RotationData = { x: number, y: number, z: number }

export type SpeedData = { speed: number }

export type BodyData = { w: number, h: number, color: string }

export type CanvasData = { fillColor: string, w: number, h: number }

export type CameraData = {
	fov: number,
	aspect: number,
	near: number,
	far: number,
	D: number,
	left: number,
	right: number,
	top: number,
	bottom: number,
	zoom: number,
	zoomFactor: number,
	maxZoom: number,
	minZoom: number,
	position: PositionData,
	rotation: RotationData,
}

export type RenderableData = {
	geometry: any;
	material: THREE.Material;
	mesh?: THREE.Mesh;
}

export type GridHelperData = {
	size: number,
	division: number,
	colorCenterLine: THREE.Color,
	colorGrid: THREE.Color
}