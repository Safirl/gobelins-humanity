import "./assets/reset.css";
// import "./style.css";
import { Experience } from "@plugins/base-experience";
import { sources } from "./Experience/sources";
import ExperienceWorld from "./Experience/ExpWorld";
import OrthoCamera from "./Experience/OrthoCamera";

const init = () => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "three",
  ) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(
      "Canvas not found: no element with id 'three' exists in the DOM.",
    );
  }

  canvas.style.width = "100%";
  canvas.style.height = "100%";
  const camera = new OrthoCamera();
  const world = new ExperienceWorld();
  new Experience(canvas, sources, camera, world);
};

init();
