import * as THREE from 'three';
import { ComponentType } from "../enums/ComponentType";

const body_player = {
  w: 1,
  h: 1,
  depth: 1,
}
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "../assets/sky_cube.jpg"
)


const geometry = new THREE.BoxGeometry(body_player.w, body_player.h, body_player.depth)
// const material = new THREE.MeshStandardMaterial({ color: 0xff00ff })

const material = new THREE.MeshStandardMaterial({
  map: texture,
  roughness: 0.5,
  metalness: 0.5,
  color:0xff00ff,
});
const mesh = new THREE.Mesh(geometry, material)
mesh.castShadow = true;
mesh.receiveShadow = true;

export const player = [
  { type: ComponentType.Player, data: true },
  { type: ComponentType.Name, data: { name: "Brutus - Player" } },
  { type: ComponentType.Direction, data: { direction: 0 } },
  { type: ComponentType.Position, data: { x: 0.5, y: 1, z: 0.5 } },
  { type: ComponentType.Rotation, data: { x: 0.5, y: 1, z: 0.5 } },
  { type: ComponentType.Body, data: body_player },
  { type: ComponentType.Movable, data: true },
  { type: ComponentType.Health, data: { life: 100 } },
  { type: ComponentType.Speed, data: { speed: 30 } },
  { type: ComponentType.Renderable, data: { mesh: mesh } },
  { type: ComponentType.Colision, data: { active: true } },
]