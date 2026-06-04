import { Debug, Experience } from "@plugins/base-experience";
import type GUI from "lil-gui";
import * as THREE from "three";
//@ts-ignore
import fragment from "@shaders/cellParticles/fragment.glsl";
//@ts-ignore
import vertex from "@shaders/cellParticles/vertex.glsl";
import type ExperienceWorld from "./ExpWorld";

export default class CelleParticles {
  declare private points: THREE.Points;

  //parameters
  private count = 300;
  public noiseAmplitude: number = 0.2;
  public noiseFrequency: number = 0.1;
  public size = 150;

  declare private width: number;
  declare private height: number;

  declare private experience: Experience;
  declare private debug: Debug;
  declare private debugFolder: GUI;
  private textures: THREE.Texture[] = [];

  constructor(width: number, height: number, textureCount: number) {
    if (!Experience.instance) return;
    this.experience = Experience.instance;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder =
        this.experience.debug.ui.addFolder("🩸 Cell particles");
      this.setDebugObject();
    }

    this.width = width;
    this.height = height;

    /** start Target white cell texture */

    for (let i = 1; i < textureCount + 1; i++) {
      const targetTexture = this.experience.resources.items[
        `${i}cellTexture`
      ] as THREE.Texture;
      if (!targetTexture) {
        console.warn(`invalid texture found for 0${i}cellTexture`);
        continue;
      }
      this.textures.push(targetTexture);
    }

    /** end get white pixels positions */

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const randCorePos = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const randomX = (Math.random() - 0.5) * width;
      const randomY = (Math.random() - 0.5) * height;
      const randomZ = (Math.random() - 0.5) * this.size;

      positions[i3 + 0] = randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = 0.1;

      const randomCoreX = (Math.random() - 0.5) * 0.25;
      const randomCoreY = (Math.random() - 0.5) * 0.25;
      const randomCoreZ = Math.random();

      randCorePos[i3 + 0] = randomCoreX;
      randCorePos[i3 + 1] = randomCoreY;
      randCorePos[i3 + 2] = 0;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute(
      "aRandCorePositions",
      new THREE.BufferAttribute(randCorePos, 3),
    );

    //Noise
    const noiseTexture = this.experience.resources.items
      .noiseTexture as THREE.Texture;
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;

    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uSize: { value: this.size },
        uPixelRatio: {
          value: this.experience.renderer.instance.getPixelRatio(),
        },
        uTime: { value: 0 },
        uNoiseTexture: {
          value: noiseTexture,
        },
        uNoiseAmplitude: { value: this.noiseAmplitude },
        uNoiseFrequency: { value: this.noiseFrequency },
      },
    });

    this.points = new THREE.Points(geometry, material);
    this.experience.scene.add(this.points);

    //Setup audio listener
    const world = this.experience.world as ExperienceWorld;
    world.musicHandler.audio.onAudio(this.onAudio);
  }

  onAudio = (a) => {
    //@ts-ignore
    this.points.material.uniforms.uNoiseAmplitude.value =
      a.volumeSmooth * this.noiseAmplitude;
    //@ts-ignore
    this.points.material.uniforms.uSize.value =
      this.size * a.volumeSmooth + 100;
  };

  setDebugObject = () => {
    this.debugFolder
      .add(this, "noiseAmplitude")
      .min(0.01)
      .max(1)
      .step(0.01)
      .onChange(() => {
        //@ts-ignore
        this.points.material.uniforms.uNoiseAmplitude.value =
          this.noiseAmplitude;
      });

    this.debugFolder
      .add(this, "noiseFrequency")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange(() => {
        //@ts-ignore
        this.points.material.uniforms.uNoiseFrequency.value =
          this.noiseFrequency;
      });

    this.debugFolder
      .add(this, "size")
      .min(1)
      .max(150)
      .step(1)
      .onChange(() => {
        //@ts-ignore
        this.points.material.uniforms.uSize.value = this.size;
      });
  };

  update() {
    //@ts-ignore
    this.points.material.uniforms.uTime.value = this.experience.time.elapsed;
  }

  updatePositionTexture = (index: number) => {
    if (!this.textures[index]) return;
    const newTexture = this.textures[index];
    const whitePixels = this.getWhitePixels(newTexture);
    const targetPos = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      const pixel = whitePixels[Math.floor(Math.random() * whitePixels.length)];
      targetPos[i * 3 + 0] = (pixel.x - 0.5) * this.width * 0.6;
      targetPos[i * 3 + 1] = (pixel.y - 0.5) * this.height * 0.6;
      targetPos[i * 3 + 2] = 1;
    }
    this.points.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(targetPos, 3),
    );
    this.points.geometry.attributes.position.needsUpdate = true;

    this.updateAmplitude(index);
  };

  updateAmplitude = (index: number) => {
    // this.points.material.uniforms.uNoiseAmplitude.value =
    //   index * 0.5 * this.noiseAmplitude;
  };

  getWhitePixels = (
    targetTexture: THREE.Texture,
  ): { x: number; y: number }[] => {
    const image = targetTexture.image as HTMLImageElement;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0);

    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return [];

    const pixels = imageData.data;

    const whitePixels: { x: number; y: number }[] = [];

    for (let y = 0; y < imageData?.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const i = (y * imageData.width + x) * 4;
        const alpha = pixels[i];

        if (alpha > 0.9) {
          whitePixels.push({
            x: x / imageData.width,
            y: 1 - y / imageData.height,
          });
        }
      }
    }
    return whitePixels;
  };

  setVisibility = (newVisibility: boolean) => {
    this.points.visible = newVisibility;
  };
}
