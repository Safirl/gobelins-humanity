import { Experience } from "@plugins/base-experience";
import * as THREE from "three";
//@ts-ignore
import fragment from "@shaders/human/fragment.glsl";
//@ts-ignore
import vertex from "@shaders/human/vertex.glsl";

export default class Plane {
  declare private experience: Experience;
  declare private videoPlane: THREE.Mesh;
  private textures: THREE.Texture[] = [];

  constructor(textureCount: number) {
    if (!Experience.instance) return;
    this.experience = Experience.instance;

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
  }

  setTexture = (index: number) => {
    const mat = this.videoPlane.material as THREE.ShaderMaterial;
    mat.uniforms.uFigureTexture.value = this.textures[index];
  };

  setVisibility(isVisible: boolean) {
    this.videoPlane.visible = isVisible;
  }
}
