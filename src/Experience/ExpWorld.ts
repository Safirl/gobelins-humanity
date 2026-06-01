import { World } from "@plugins/base-experience";
import type { Camera } from "three";
import type OrthoCamera from "./OrthoCamera";
import * as THREE from "three";
//@ts-ignore
import fragment from "@shaders/experience/fragment.glsl";
//@ts-ignore
import vertex from "@shaders/experience/vertex.glsl";

export default class ExperienceWorld extends World {
  declare private camera: Camera;

  //tweaks
  private cellSize: number = 1;
  private cellCount: number = 200;

  constructor() {
    super();
  }
  init(): void {
    super.init();
    const finalPos = new Float32Array(this.cellCount * 4);
    for (let i = 0; i < this.cellCount; i++) {
      finalPos[i * 4 + 0] = Math.random();
      finalPos[i * 4 + 1] = Math.random();
      finalPos[i * 4 + 2] = 1;
      finalPos[i * 4 + 3] = 1;
    }

    const finalPositionDataTexture = new THREE.DataTexture(
      finalPos,
      this.cellCount,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    finalPositionDataTexture.needsUpdate = true;

    const geometry = new THREE.BufferGeometry();
    //prettier-ignore
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([
            -1, -1, 0,
             3, -1, 0,
            -1,  3, 0
        ], 3)
    );
    const texture = this.experience.resources.items.figureTexture;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uFigureTexture: { value: texture },
        uPositionTexture: { value: finalPositionDataTexture },
        uCellCount: { value: this.cellCount },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });
    const triangle = new THREE.Mesh(geometry, material);
    this.experience.scene.add(triangle);
  }
}
