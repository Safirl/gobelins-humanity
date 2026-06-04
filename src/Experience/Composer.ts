import { Debug, Experience } from "@plugins/base-experience";
import { RGBShiftShader } from "three/addons/shaders/RGBShiftShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import type GUI from "lil-gui";
import * as THREE from "three";
import type ExperienceWorld from "./ExpWorld";

export default class Composer {
  declare private experience: Experience;
  //pixel
  // declare bloomPass: UnrealBloomPass;

  //bloom
  declare bloomPass: UnrealBloomPass;
  public bloomThreshold: number = 0.85;
  public bloomStrength: number = 0.4;
  public bloomRadius: number = 0.4;
  public bloomEasing: number = 0.4;

  //shift
  declare rgbShift: ShaderPass;
  public shiftAmount: number = 0.0042;
  public shiftOffset: number = 0.0027;
  declare private debug: Debug;
  declare private debugFolder: GUI;

  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("🌟 composer");
      this.setDebugObject();
    }
    //RGB rgbShift
    this.rgbShift = new ShaderPass(RGBShiftShader);
    this.rgbShift.uniforms["amount"].value = this.shiftAmount;
    this.experience.renderer.addComposerPass(this.rgbShift);

    //Bloom pass is added by the flipFlop function of the experience
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.04,
      0.001,
      0.85,
    );

    //Setup audio listener
    const world = this.experience.world as ExperienceWorld;
    world.musicHandler.audio.onAudio(this.onAudio);
  }

  onAudio = (a) => {
    // console.log(a.freqBytes[0]);
    // console.log(a.freqBytes);
    //@ts-ignore
    this.rgbShift.uniforms.amount.value =
      this.shiftAmount * a.kick + this.shiftOffset;
    // this.bloomPass.strength =
    //   this.bloomStrength * a.volumeSmooth * this.bloomEasing;
    // //@ts-ignore
    // this.points.material.uniforms.uSize.value =
    //   this.size * a.volumeSmooth + 100;
  };

  setDebugObject() {
    if (!this.debug.active) {
      return;
    }
    const rgbFolder = this.debugFolder.addFolder("🎨 RGB SHIFT");
    rgbFolder.add(this, "shiftAmount").min(0.0001).max(0.1).step(0.0001);
    rgbFolder.add(this, "shiftOffset").min(0.0001).max(0.1).step(0.0001);
    // .onChange(() => {
    //   this.rgbShift.uniforms["amount"].value =
    //     this.shiftAmount + this.shiftOffset;
    // });

    const bloomFolder = this.debugFolder.addFolder("🌄 Bloom");

    bloomFolder
      .add(this, "bloomThreshold")
      .min(0.01)
      .max(1000)
      .step(0.01)
      .onChange(() => {
        this.bloomPass.threshold = this.bloomThreshold;
      });
    bloomFolder
      .add(this, "bloomStrength")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.bloomPass.strength = this.bloomStrength;
      });
    bloomFolder
      .add(this, "bloomRadius")
      .min(0.1)
      .max(1)
      .step(0.1)
      .onChange(() => {
        this.bloomPass.radius = this.bloomRadius;
      });

    bloomFolder.add(this, "bloomEasing").min(0.1).max(1).step(0.01);
  }

  enableBloom = (enable: boolean) => {
    if (enable) {
      this.experience.renderer.addComposerPass(this.bloomPass);
    } else {
      this.experience.renderer.removeComposerPass(this.bloomPass);
    }
  };
}
