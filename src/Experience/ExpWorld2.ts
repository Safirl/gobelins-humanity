import { EventEmitter, Experience } from "@plugins/base-experience";
import { Environment } from "@plugins/base-experience";
import { Floor } from "@plugins/base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { Actor } from "@plugins/base-experience";
import { World } from "@plugins/base-experience";
import * as THREE from "three";

import CelleParticles from "./CellParticles";
import Plane from "./Plane";
import Composer from "./Composer";
import type ExperienceCamera from "./OrthoCamera";

export default class ExperienceWorld extends World {
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare videoPlane: THREE.Mesh;
  private figures: THREE.Texture[] = [];
  private currentFigure = 0;
  declare private cells: CelleParticles;
  declare private plane: Plane;
  private flipFlop: boolean = true;
  declare private composer: Composer;

  public textureCount = 41;

  public beatDelay = 0.411 / 1;

  init() {
    super.init();

    this.experience.sizes.on("resize", this.resize);

    for (let i = 1; i < 9; i++) {
      const humanTexture =
        this.experience.resources.items[`0${i}figureTexture`];
      if (humanTexture) this.figures.push(humanTexture as THREE.Texture);
    }
    this.composer = new Composer();

    this.plane = new Plane(this.textureCount);
    this.cells = new CelleParticles(
      1920 / 1080,
      1080 / 1080,
      this.textureCount,
    );
    // this.manualBeatTrigger();
    this.experience.canvas.addEventListener("click", this.nextFigure);
  }

  manualBeatTrigger = () => {
    this.nextFigure();
    const camera = this.experience.camera as ExperienceCamera;
    camera.bumpCamera();
    setTimeout(() => {
      this.manualBeatTrigger();
    }, this.beatDelay * 1000);
  };

  nextFigure = () => {
    //if we did two passes, switch to new textures
    if (this.flipFlop) {
      this.plane.setTexture(this.currentFigure);
      this.cells.updatePositionTexture(this.currentFigure);
    }

    this.plane.setVisibility(this.flipFlop);
    this.cells.setVisibility(!this.flipFlop);
    this.composer.enableBloom(this.flipFlop);

    if (this.flipFlop) this.currentFigure++;

    if (this.currentFigure == this.textureCount) {
      this.currentFigure = 0;
    }

    this.flipFlop = !this.flipFlop;
  };

  update() {
    if (this.cells) this.cells.update();
  }

  resize = () => {
    // const geom = this.videoPlane?.geometry as THREE.PlaneGeometry
    // geom.
  };
}
