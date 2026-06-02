import { Experience } from "@plugins/base-experience";
import { Environment } from "@plugins/base-experience";
import { Floor } from "@plugins/base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { Actor } from "@plugins/base-experience";
import { World } from "@plugins/base-experience";
import * as THREE from "three";
import fragment from "@shaders/human/fragment.glsl";
import vertex from "@shaders/human/vertex.glsl";
import CelleParticles from "./CellParticles";

export default class ExperienceWorld extends World {
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare videoPlane: THREE.Mesh;
  private figures: THREE.Texture[] = [];
  private currentFigure = 0;
  declare private cells: CelleParticles;

  init() {
    super.init();

    this.experience.sizes.on("resize", this.resize);
    // this.floor = new Floor();
    //Fox is just an actor because it doesn't have any logic in it.
    // this.environment = new Environment(
    //   this.resources.items.environmentMapTexture1 as THREE.CubeTexture,
    //   false,
    // );
    for (let i = 1; i < 9; i++) {
      const humanTexture =
        this.experience.resources.items[`0${i}figureTexture`];
      if (humanTexture) this.figures.push(humanTexture as THREE.Texture);
    }
    // const humanTexture = this.figures[6];
    const humanTexture = this.experience.resources.items["01figureTexture"];
    const planeGeometry = new THREE.PlaneGeometry(1920 / 1080, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uFigureTexture: { value: humanTexture },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });
    this.videoPlane = new THREE.Mesh(planeGeometry, material);
    // this.experience.scene.add(this.videoPlane);
    this.cells = new CelleParticles();

    document.addEventListener("click", this.nextFigure);
  }

  nextFigure = () => {
    const mat = this.videoPlane.material as THREE.ShaderMaterial;
    mat.uniforms.uFigureTexture.value = this.figures[this.currentFigure];
    this.currentFigure++;
  };

  update() {}

  resize = () => {
    // const geom = this.videoPlane?.geometry as THREE.PlaneGeometry
    // geom.
  };
}
