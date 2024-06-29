import { ComponentType } from "../enums/ComponentType"

const control_data = {
  isDragging: false,
  previousMousePosition: { x: 0, y: 0 }
}
//Camera
export const camera = [
  {
    type: ComponentType.Camera,
    data: {
      fov: 30,
      aspect: 0,
      near: 0.1,
      far: 1000,
      D: 1,
      zoom: 0.2,
      zoomFactor: 2,
      maxZoom: 2,
      minZoom: 0.2,
      left: 1,
      right: 1,
      top: 1,
      bottom: 1,
    }
  },
  { type: ComponentType.CameraControl, data: control_data },
  { type: ComponentType.Position, data: { x: 5, y: 2, z: 5 } },
  { type: ComponentType.Rotation, data: { x: 0, y: 0, z: 0 } }
]
export const canvas = [
  {
    type: ComponentType.Canvas, data: {
      fillColor: "lightBlue",
      w: 600,
      h: 300
    }
  },
]
