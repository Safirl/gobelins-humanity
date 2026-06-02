import { Debug, World } from "@plugins/base-experience";
import type { Camera } from "three";
import type ExperienceCamera from "./OrthoCamera";
import * as THREE from "three";
//@ts-ignore
import fragment from "@shaders/experience/fragment.glsl";
//@ts-ignore
import vertex from "@shaders/experience/vertex.glsl";
import gsap from "gsap";
import type GUI from "lil-gui";

export default class ExperienceWorld extends World {
  declare private camera: Camera;

  //tweaks
  private cellSize: number = 0.085;
  private cellFieldSize: number = 120;
  private cellCount: number = 200;
  private borderWidth: number = 2.5;
  private centerSize: number = 0.004;
  declare private material: THREE.ShaderMaterial;
  declare private debug: Debug;
  declare private debugFolder: GUI;

  constructor() {
    super();
  }
  init(): void {
    super.init();
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🌎️ world");
    }

    const noiseTexture = this.experience.resources.items
      .noiseTexture as THREE.Texture;
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;
    //Random initial position
    const initialPos = new Float32Array(this.cellCount * 4);
    for (let i = 0; i < this.cellCount; i++) {
      initialPos[i * 4 + 0] = Math.random();
      initialPos[i * 4 + 1] = Math.random();
      initialPos[i * 4 + 2] = 1;
      initialPos[i * 4 + 3] = 1;
    }

    const initPosDataTexture = new THREE.DataTexture(
      initialPos,
      this.cellCount,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    initPosDataTexture.needsUpdate = true;

    //Target white cell texture
    const targetTexture = this.experience.resources.items
      .figureTexture as THREE.Texture;
    const image = targetTexture.image as HTMLImageElement;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0);

    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;

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

    const targetPos = new Float32Array(this.cellCount * 4);
    for (let i = 0; i < this.cellCount; i++) {
      const pixel = whitePixels[Math.floor(Math.random() * whitePixels.length)];
      targetPos[i * 4 + 0] = pixel.x;
      targetPos[i * 4 + 1] = pixel.y;
      targetPos[i * 4 + 2] = 1;
      targetPos[i * 4 + 3] = 1;
    }

    const targetPosTexture = new THREE.DataTexture(
      targetPos,
      this.cellCount,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    targetPosTexture.needsUpdate = true;

    //Create geometry triangle
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
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTargetTexture: { value: targetTexture },
        uStartPosTexture: { value: initPosDataTexture },
        uTargetPosTexture: { value: targetPosTexture },
        uCellCount: { value: this.cellCount },
        uCellSize: { value: this.cellSize },
        uCellFieldSize: { value: this.cellFieldSize },
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(
            this.experience.sizes.width,
            this.experience.sizes.height,
          ),
        },
        uBorderWidth: { value: this.borderWidth },
        uCenterSize: { value: this.centerSize },
        uNoiseTexture: { value: noiseTexture },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });
    const triangle = new THREE.Mesh(geometry, this.material);
    this.experience.scene.add(triangle);
    this.setDebugObject();

    this.startAnimation();
  }

  startAnimation(): void {
    gsap.to(this.material.uniforms.uProgress, {
      value: 1,
      duration: 5,
      ease: "power2.inOut",
    });
  }

  update(): void {
    super.update();
    if (this.material) {
      this.material.uniforms.uTime.value = this.experience.time.elapsed * 0.001;
    }
  }

  setDebugObject() {
    if (!this.material) return;
    this.debugFolder
      .add(this.material.uniforms.uCellSize, "value")
      .name("cell size")
      .min(0)
      .max(0.1)
      .step(0.001);

    this.debugFolder
      .add(this.material.uniforms.uCellFieldSize, "value")
      .name("field size")
      .min(0.1)
      .max(60)
      .step(0.1);

    this.debugFolder
      .add(this.material.uniforms.uBorderWidth, "value")
      .name("border size")
      .min(0.1)
      .max(60)
      .step(0.1);
    this.debugFolder
      .add(this.material.uniforms.uCenterSize, "value")
      .name("center size")
      .min(0.001)
      .max(1)
      .step(0.001);
  }
}
