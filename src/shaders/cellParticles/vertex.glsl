varying vec2 vUv;
attribute vec3 aRandCorePositions;
varying vec3 vRandCorePosition;
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform float uNoiseAmplitude;
uniform float uNoiseFrequency;

void main() {
    // vec2 targetPos = texture2D(uTargetPosTexture, vec2(tx, 0.5)).rg;
    vec2 noiseOffset = vec2(
            texture2D(uNoiseTexture, position.xy + uTime * uNoiseFrequency * 0.001 + vRandCorePosition.x).r,
            texture2D(uNoiseTexture, position.xy + uTime * uNoiseFrequency * 0.001 + vRandCorePosition.y).r
        ) - 0.5;

    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    // modelPosition.x += (sin(noiseUv.y) / 2.) * 5.;
    // modelPosition.y += (sin(noiseUv.x) / 2.) * 5.;
    modelPosition.xy += noiseOffset * uNoiseAmplitude;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // float sizeNoise = texture2D(uNoiseTexture, position.xy * 3.7 * uTime * .0001 + vRandCorePosition.z).r;
    gl_PointSize = uSize * (noiseOffset.g + .5) * uPixelRatio * (1.0 / -viewPosition.z);
    vUv = uv;
    vRandCorePosition = aRandCorePositions;
}
