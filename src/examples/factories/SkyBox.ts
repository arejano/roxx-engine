import * as THREE from 'three';
import { ComponentType } from "../enums/ComponentType";


const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  // 'path/to/your/blue_skybox_px.jpg', // Right
  // 'path/to/your/blue_skybox_nx.jpg', // Left
  // 'path/to/your/blue_skybox_py.jpg', // Top
  // 'path/to/your/blue_skybox_ny.jpg', // Bottom
  // 'path/to/your/blue_skybox_pz.jpg', // Back
  // 'path/to/your/blue_skybox_nz.jpg'  // Front

  "src/examples/assets/sky_cube.jpg",
  // "src/examples/assets/sky_cube.jpg",
  // "src/examples/assets/sky_cube.jpg",
  // "src/examples/assets/sky_cube.jpg",
  // "src/examples/assets/sky_cube.jpg",
  // "src/examples/assets/sky_cube.jpg",
]);

// Criar material do Skybox (sem iluminação)
const skyboxMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  color:0xFFFFFF,
  side: THREE.BackSide // Renderizar apenas o lado de fora do cubo
});

// Criar geometria do Skybox (cubo grande o suficiente para envolver a cena)
const skyboxGeometry = new THREE.BoxGeometry(100, 100,100);

// Criar a malha do Skybox

const mesh = new THREE.Mesh(skyboxGeometry, skyboxMaterial);


export const skybox = [
  {
    type: ComponentType.Renderable,
    data: { mesh: mesh }
  },
  { type: ComponentType.Position, data: { x: 0, y: 2, z: 0 } },
]