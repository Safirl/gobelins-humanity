import type { Source } from "@plugins/base-experience";

export const sources: Source[] = [
  // {
  //   name: "environmentMapTexture",
  //   type: "cubeTexture",
  //   path: [
  //     "textures/environmentMap/px.jpg",
  //     "textures/environmentMap/nx.jpg",
  //     "textures/environmentMap/py.jpg",
  //     "textures/environmentMap/ny.jpg",
  //     "textures/environmentMap/pz.jpg",
  //     "textures/environmentMap/nz.jpg",
  //   ],
  // },
  {
    name: "environmentMapTexture1",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/1/px.png",
      "textures/environmentMap/1/nx.png",
      "textures/environmentMap/1/py.png",
      "textures/environmentMap/1/ny.png",
      "textures/environmentMap/1/pz.png",
      "textures/environmentMap/1/nz.png",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/dirt/normal.jpg",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "models/Fox/glTF/Fox.gltf",
  },
  {
    name: "figureTexture",
    type: "texture",
    path: "textures/text.png",
  },
  {
    name: "blackTexture",
    type: "texture",
    path: "textures/black.png",
  },
  {
    name: "noiseTexture",
    type: "texture",
    path: "textures/noiseTexture.png",
  },
  {
    name: "01figureTexture",
    type: "texture",
    path: "textures/figures/01.png",
  },
  {
    name: "02figureTexture",
    type: "texture",
    path: "textures/figures/02.png",
  },
  {
    name: "03figureTexture",
    type: "texture",
    path: "textures/figures/03.png",
  },
  {
    name: "04figureTexture",
    type: "texture",
    path: "textures/figures/04.png",
  },
  {
    name: "05figureTexture",
    type: "texture",
    path: "textures/figures/05.png",
  },
  {
    name: "06figureTexture",
    type: "texture",
    path: "textures/figures/06.png",
  },
  {
    name: "07figureTexture",
    type: "texture",
    path: "textures/figures/07.png",
  },
  {
    name: "08figureTexture",
    type: "texture",
    path: "textures/figures/08.png",
  },
  // {
  //   name: "noiseTexture",
  //   type: "texture",
  //   path: "textures/noiseTexture.png",
  // },
];
