import * as THREE from "three";
import { Camera } from "@plugins/base-experience";

export default class OrthoCamera extends Camera {
  //@ts-ignore
  declare instance: THREE.Camera;
  setInstance(): void {
    this.instance = new THREE.Camera();
    super.setInstance();
  }
  setDebugObject(): void {
    return;
  }
  resize(): void {
    return;
  }
}
