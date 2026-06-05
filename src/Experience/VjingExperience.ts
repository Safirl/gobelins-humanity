import {
  Camera,
  Experience,
  World,
  type Source,
} from "@plugins/base-experience";
import type MusicHandler from "./MusicHandler";

export default class VjingExperience extends Experience {
  declare private musicHandler: MusicHandler;
  public isActive = false;
  constructor(
    canvas: HTMLCanvasElement,
    sources: Source[],
    camera: Camera,
    world: World,
    musicHandler: MusicHandler,
  ) {
    super(canvas, sources, camera, world);
    this.musicHandler = musicHandler;
    this.musicHandler.audio.onPlay(() => {
      this.isActive = true;
    });
    this.musicHandler.audio.onStop(() => {
      this.isActive = false;
    });
    this.musicHandler.audio.onWarmup(() => {
      this.stats?.update();
      this.camera.update();
      this.world.update();
      this.inputSystem.update();
      this.renderer.update();
      for (let i = 0; i < 7; i++) {
        this.update();
      }
    });
  }

  update(): void {
    if (!this.isActive) return;
    super.update();
  }
}
