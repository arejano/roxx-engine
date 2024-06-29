import * as THREE from 'three';
import { ComponentType } from "../enums/ComponentType";


const geometry = new THREE.PlaneGeometry(10, 10);

const material = new THREE.MeshStandardMaterial({
  color: 0x808080, // Cinza
  roughness: 0.8,
  metalness: 0.2
});
const mesh = new THREE.Mesh(geometry, material);
mesh.receiveShadow = true;

// Rotacionar o plano para ficar horizontal
mesh.rotation.x = -Math.PI / 2;


export const plane = [
  {
    type: ComponentType.Renderable,
    data: { mesh: mesh }
  },
  { type: ComponentType.Colision, data: { active: true } },
  { type: ComponentType.Position, data: { x: 0, y: 0.5, z: 0 } },
]