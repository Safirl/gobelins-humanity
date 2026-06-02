varying vec2 vUv;
attribute vec3 aRandCorePositions;
varying vec3 vRandCorePosition;
uniform float uPixelRatio;
uniform float uSize;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -viewPosition.z);
    vUv = uv;
    vRandCorePosition = aRandCorePositions;
}
