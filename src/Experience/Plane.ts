import { Debug, Experience } from "@plugins/base-experience";
import * as THREE from "three";
//@ts-ignore
import fragment from "@shaders/human/fragment.glsl";
//@ts-ignore
import vertex from "@shaders/human/vertex.glsl";
import type ExperienceWorld from "./ExpWorld";
import type GUI from "lil-gui";

export default class Plane {
  declare private experience: Experience;
  declare private videoPlane: THREE.Mesh;
  private textures: THREE.Texture[] = [];
  declare private debugFolder: GUI;
  declare private debug: Debug;
  public shakeEasing: number = 0.3;

  constructor(textureCount: number) {
    if (!Experience.instance) return;
    this.experience = Experience.instance;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🌟 composer");
      this.setDebugObject();
    }
    for (let i = 1; i < textureCount + 1; i++) {
      const targetTexture = this.experience.resources.items[
        `${i}figureTexture`
      ] as THREE.Texture;
      if (!targetTexture) {
        console.warn(`invalid texture found for 0${i}cellTexture`);
        continue;
      }
      this.textures.push(targetTexture);
    }

    const humanTexture = this.textures[0];
    const planeGeometry = new THREE.PlaneGeometry(1920 / 1080, 1080 / 1080);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uFigureTexture: { value: humanTexture },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });
    this.videoPlane = new THREE.Mesh(planeGeometry, material);
    this.experience.scene.add(this.videoPlane);
    const world = this.experience.world as ExperienceWorld;
    world.musicHandler.audio.onAudio(this.onAudio);
  }
  //Setup audio listener

  onAudio = (a) => {
    this.shakePlane(a);
  };
  setTexture = (index: number) => {
    const mat = this.videoPlane.material as THREE.ShaderMaterial;
    mat.uniforms.uFigureTexture.value = this.textures[index];
  };
  setDebugObject = () => {
    this.debugFolder.add(this, "shakeEasing").min(0.01).max(1).step(0.01);
  };

  setVisibility(isVisible: boolean) {
    this.videoPlane.visible = isVisible;
  }

  shakePlane = (a: any) => {
    this.videoPlane.position.x = 0;
    this.videoPlane.position.y = 0;
    this.videoPlane.position.z = 0;
    const shake = (a.kickHard ?? 0) * 0.16 + (a.kick ?? 0) * 0.06;
    if (shake > 0.01) {
      this.videoPlane.position.x +=
        (Math.random() - 0.5) * shake * this.shakeEasing;
      this.videoPlane.position.y +=
        (Math.random() - 0.5) * shake * this.shakeEasing;
      this.videoPlane.position.z +=
        (Math.random() - 0.5) * shake * this.shakeEasing;
    }
  };
}
