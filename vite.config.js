// import restart from 'vite-plugin-restart'
import glsl from "vite-plugin-glsl";
import { defineConfig } from "vitest/config";
import { resolve } from "path";
import vjTracksPlugin from './vite-plugin-vj-tracks.js'

export default defineConfig({
  plugins: [
    // restart({ restart: ["../public/**"] }), // Restart server on static file change
    glsl(), // Handle shader files
    vjTracksPlugin(),
  ],
  resolve: {
    alias: {
      "@plugins": resolve(__dirname, "src/plugins"),
      "@shaders": resolve(__dirname, "src/shaders"),
    },
  },
  test: {
    environment: "node",
  },
});
