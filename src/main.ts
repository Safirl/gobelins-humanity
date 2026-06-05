import "./assets/reset.css";
// import "./style.css";
import { Experience } from "@plugins/base-experience";
import { sources } from "./Experience/sources";
import ExperienceWorld from "./Experience/ExpWorld";
import ExperienceCamera from "./Experience/OrthoCamera";
import MusicHandler from "./Experience/MusicHandler";
import VjingExperience from "./Experience/VjingExperience";

const init = () => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "three",
  ) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(
      "Canvas not found: no element with id 'three' exists in the DOM.",
    );
  }

  const musicHandler = new MusicHandler();

  musicHandler.audio.onLoad(async () => {
    const camera = new ExperienceCamera();
    const world = new ExperienceWorld(musicHandler);
    const exp = new VjingExperience(
      canvas,
      sources,
      camera,
      world,
      musicHandler,
    );
    await exp.load(sources);
  });

  canvas.style.width = "100%";
  canvas.style.height = "100%";
};

init();
