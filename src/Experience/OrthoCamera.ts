import * as THREE from "three";
import { Camera } from "@plugins/base-experience";
import gsap from "gsap";
import type ExperienceWorld from "./ExpWorld";

export default class ExperienceCamera extends Camera {
  //@ts-ignore
  // declare instance: THREE.Camera;
  //
  //
  declare animCtx: gsap.Context;
  public initialDistance: number = 1.78;
  private targetDistance: number = 5;
  declare private world: ExperienceWorld;

  init(): void {
    super.init();
    // this.experience.canvas.addEventListener("click", this.bumpCamera);
    this.world = this.experience.world as ExperienceWorld;
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
    const targetPosition = Math.max(
      Math.random() * this.targetDistance,
      this.initialDistance,
    );

    let step = this.targetDistance / this.world.textureCount;

    if (currentPosition.z > targetPosition) {
      step *= -1;
    }

    this.animCtx = gsap.context((self) => {
      gsap.to(this.instance.position, {
        z: targetPosition + step * 2,
        duration: this.world.beatDelay / 4,
        onComplete: () => {
          gsap.to(this.instance.position, {
            z: targetPosition,
            duration: this.world.beatDelay / 4,
            // ease: "power2.in",
          });
        },
      });
    });
  };
}
