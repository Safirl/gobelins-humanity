import { Debug, Experience } from "@plugins/base-experience";
import type GUI from "lil-gui";
import * as THREE from "three";
import fragment from "@shaders/cellParticles/fragment.glsl";
import vertex from "@shaders/cellParticles/vertex.glsl";

export default class CelleParticles {
  declare private points: THREE.Points;

  //parameters
  private count = 50;
  private size = 0.5;

  declare private experience: Experience;
  declare private debug: Debug;
  declare private debugFolder: GUI;

  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance;
    this.debug = this.experience.debug;
    this.debugFolder = this.experience.debug.ui.addFolder("🩸 Cell particles");

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const randCorePos = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const randomX = (Math.random() - 0.5) * 2 * this.size;
      const randomY = (Math.random() - 0.5) * 2 * this.size;
      const randomZ = (Math.random() - 0.5) * 2 * this.size;

      positions[i3 + 0] = randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = 0.1;

      const randomCoreX = Math.random();
      const randomCoreY = Math.random();
      const randomCoreZ = Math.random();

      randCorePos[i3 + 0] = randomCoreX;
      randCorePos[i3 + 1] = randomCoreY;
      randCorePos[i3 + 2] = 0;
      console.log(randomCoreX);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute(
      "aRandCorePositions",
      new THREE.BufferAttribute(randCorePos, 3),
    );

    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uSize: { value: 100 },
        uPixelRatio: {
          value: this.experience.renderer.instance.getPixelRatio(),
        },
        uTime: { value: 0 },
      },
    });

    this.points = new THREE.Points(geometry, material);
    this.experience.scene.add(this.points);
  }

  setDebugObject = () => {};
}
