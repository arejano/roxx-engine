import { ECS } from '../ecs/ecs';
import { Engine } from '../engine/engine';
import { GameMode } from './enums/GameMode';
import { GameEvent } from './enums/GameEvent';
import { GameKeyboardSystem, KeyboardSystem } from './systems/KeyboardSystem';
import { RenderSystem } from './systems/RenderSystem';
import { PlayerMovementSystem } from './systems/PlayerMovementSystem';
import { DebugSystem } from './systems/DebugSystem';

import { camera, canvas } from './factories/Camera';
import { player } from './factories/Player';
import { grid_helper } from './factories/GridHelper';
import { MouseSystem } from './systems/MouseSystem';
import { plane } from './factories/Plane';
import { CameraZoomSystem } from './systems/CameraZoomSystem';
import { CameraControlSystem } from './systems/CameraControllerSystem';
import { skybox } from './factories/SkyBox';
import { DatGUISystem } from './systems/DatGuiSystem';
import { d1, d2, lights } from './factories/DirectionalLight';


export class GameDemo {
  world: ECS;
  engine: Engine | undefined = undefined;

  constructor() {
    this.world = new ECS();

    this.world.addEntity(player)
    this.world.addEntity(camera)
    this.world.addEntity(canvas)
    this.world.addEntity(grid_helper)

    this.world.addEntity(plane)
    this.world.addEntity(skybox)

    for (const l of lights) {
      this.world.addEntity(l)
    }

    //Conjunto Keyboard
    this.world.addSystem(new KeyboardSystem())
    this.world.addSystem(new GameKeyboardSystem())
    this.world.addSystem(new MouseSystem())

    this.world.addSystem(new CameraZoomSystem())
    this.world.addSystem(new CameraControlSystem("gameCanvas"))
    this.world.addSystem(new PlayerMovementSystem())
    this.world.addSystem(new RenderSystem())
    this.world.addSystem(new DebugSystem())
    this.world.addSystem(new DatGUISystem())

    this.world.setGameMode(GameMode.Running)
    this.world.setTickMode(GameEvent.Tick)
  }

  run() {
    this.engine = new Engine(this.world);
    this.engine.start();

    setTimeout(() => {
      // this.engine?.stop();
    }, 1000)
  }
}
