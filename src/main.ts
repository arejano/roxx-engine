import { ECS } from "./ecs/ecs";
import { Engine } from "./engine/engine";
import { ComponentType, GameEvent, GameMode, KeyboardSystem, PlayerMovementSystem, RenderSystem } from "./examples/game_demo";


const world = new ECS();


//Player Entity
world.addEntity([
  { type: ComponentType.Name, data: { name: "Brutus - Player" } },
  { type: ComponentType.Direction, data: { direction: 0 } },
  { type: ComponentType.Player, data: true },
  { type: ComponentType.Body, data: { w: 32, h: 64, color: "red" } },
  { type: ComponentType.Movable, data: true },
  { type: ComponentType.Health, data: { life: 100 } },
  { type: ComponentType.Position, data: { x: 0, y: 0, z: 0 } },
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
  { type: ComponentType.Position, data: { x: 400, y: 0, z: 0 } },
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
  { type: ComponentType.Position, data: { x: 100, y: 32, z: 0 } },
  { type: ComponentType.Speed, data: { speed: 200 } },
  { type: ComponentType.Renderable, data: { active: true } },
  { type: ComponentType.Colision, data: { active: true } },
])



//Canvas Entity
world.addEntity([
  {
    type: ComponentType.Canvas, data: {
      fillColor: "lightBlue",
      w: 800,
      h: 600
    }
  },
])

//Floor Entity
world.addEntity([
  { type: ComponentType.Floor, data: {} },
])

world.addSystem(new PlayerMovementSystem())
world.addSystem(new KeyboardSystem())
world.addSystem(new RenderSystem())

world.setGameMode(GameMode.Running)
world.setTickMode(GameEvent.Tick)

const engine = new Engine(world);
engine.start();


setTimeout(() => {
  engine.stop();
}, 10000)



// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

