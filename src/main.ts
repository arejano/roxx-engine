import { ECS } from "./ecs/ecs";
import { Engine } from "./engine/engine";
import { Camera3DZoomSystem } from "./examples/camera_controller";
import { ComponentType, GameEvent, GameMode, KeyboardSystem, PlayerMovementSystem, THREEJSRenderSystem } from "./examples/game_demo";

const world = new ECS();

//Player Entity
world.addEntity([
  { type: ComponentType.Name, data: { name: "Brutus - Player" } },
  { type: ComponentType.Direction, data: { direction: 0 } },
  { type: ComponentType.Player, data: true },
  { type: ComponentType.Body, data: { w: 32, h: 64, color: "red" } },
  { type: ComponentType.Movable, data: true },
  { type: ComponentType.Health, data: { life: 100 } },
  { type: ComponentType.Position, data: { x: 0, y: 236, z: 0 } },
  { type: ComponentType.Speed, data: { speed: 200 } },
  { type: ComponentType.Renderable, data: { active: true } },
  { type: ComponentType.Colision, data: { active: true } },
])


//Enemy Entity
world.addEntity([
  { type: ComponentType.Name, data: { name: "Brutus - Enemy" } },
  { type: ComponentType.Direction, data: { direction: 0 } },
  { type: ComponentType.Enemy, data: true },
  { type: ComponentType.Body, data: { w: 32, h: 64, color: "black" } },
  { type: ComponentType.Position, data: { x: 400, y: 236, z: 0 } },
  { type: ComponentType.Speed, data: { speed: 200 } },
  { type: ComponentType.Renderable, data: { active: true } },
  { type: ComponentType.Colision, data: { active: true } },
])

//Tartaruga Entity
world.addEntity([
  { type: ComponentType.Name, data: { name: "Brutus - Enemy" } },
  { type: ComponentType.Direction, data: { direction: 0 } },
  { type: ComponentType.Enemy, data: true },
  { type: ComponentType.Body, data: { w: 32, h: 32, color: "green" } },
  { type: ComponentType.Position, data: { x: 100, y: 268, z: 0 } },
  { type: ComponentType.Speed, data: { speed: 200 } },
  { type: ComponentType.Renderable, data: { active: true } },
  { type: ComponentType.Colision, data: { active: true } },
])

//Canvas Entity
world.addEntity([
  {
    type: ComponentType.Canvas, data: {
      fillColor: "lightBlue",
      w: 600,
      h: 300
    }
  },
])


//Camera
world.addEntity([
  {
    type: ComponentType.Camera,
    data: {
      fov: 9,
      aspect: 600,
      near: 1,
      far: 1000,
      D: 1,
      zoom: 1,
      zoomFactor: 1,
      maxZoom: 3,
      minZoom: 0.8,
      left: 1,
      right: 1,
      top: 1,
      bottom: 1,
    }
  },
])


//Floor Entity
world.addEntity([
  { type: ComponentType.Floor, data: {} },
])

world.addSystem(new Camera3DZoomSystem())
world.addSystem(new PlayerMovementSystem())
world.addSystem(new KeyboardSystem())
world.addSystem(new THREEJSRenderSystem())

world.setGameMode(GameMode.Running)
world.setTickMode(GameEvent.Tick)

const engine = new Engine(world);
engine.start();

setTimeout(() => {
  engine.stop();
}, 10000)

