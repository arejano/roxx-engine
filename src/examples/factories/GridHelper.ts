import * as THREE from 'three';
import { ComponentType } from "../enums/ComponentType";


const grid_data = {
  size: 100,
  division: 100,
  colorCenterLine: new THREE.Color(0xFFFF00),
  colorGrid: new THREE.Color(0xFF0000)
}
const grid = new THREE.GridHelper(
  grid_data.size,
  grid_data.division,
  grid_data.colorCenterLine,
  grid_data.colorGrid
);

export const grid_helper = [
  { type: ComponentType.Name, data: { name: "GridHelper" } },
  {
    type: ComponentType.Renderable, data: {
      mesh: grid
    }
  },
  { type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
  { type: ComponentType.GridHelper, data: grid_data },
]