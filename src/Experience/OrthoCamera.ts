import * as THREE from "three";
import { Camera } from "@plugins/base-experience";
import gsap from "gsap";

export default class ExperienceCamera extends Camera {
  //@ts-ignore
  // declare instance: THREE.Camera;
  //
  //
  declare animCtx: gsap.Context;
  private initialDistance: number = 1.9;
  init(): void {
    super.init();
    this.experience.canvas.addEventListener("click", this.bumpCamera);
  }
  setInstance(): void {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000,
    );
    this.instance.position.set(0, 0, this.initialDistance * 1);
    super.setInstance();
  }

  setDebugObject(): void {
    if (!this.debug.active) return;
    this.debugFolder
      .add(this, "initialDistance")
      .min(0.1)
      .max(10)
      .onChange(() => (this.instance.position.z = this.initialDistance));
  }

  resize(): void {
    super.resize();
    this.instance.position.set(0, 0, this.initialDistance * 1);
  }

  bumpCamera = () => {
    const currentPosition = new THREE.Vector3(
      this.instance.position.x,
      this.instance.position.y,
      this.instance.position.z,
    );
    this.animCtx = gsap.context((self) => {
      gsap.to(this.instance.position, {
        z: currentPosition.z - 0.1,
        duration: 0.1,
        onComplete: () => {
          gsap.to(this.instance.position, {
            z: currentPosition.z,
            duration: 0.1,
            ease: "power2.out",
          });
        },
      });
    });
  };
}
