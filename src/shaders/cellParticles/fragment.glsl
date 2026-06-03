varying vec2 vUv;
varying vec3 vRandCorePosition;
uniform float uSize;
uniform sampler2D uNoiseTexture;
uniform float uTime;

void main() {
    //waved uv of cells with sin functions
    vec2 wavedUv = vec2(
            gl_PointCoord.x + sin(gl_PointCoord.y * 30.0 + uTime * .01) * 0.01,
            gl_PointCoord.y + sin(gl_PointCoord.x * 30.0 + uTime * .01) * 0.01
        );

    //waved uv of cells with noise
    vec2 noiseUv = vec2(
            gl_PointCoord.x + texture2D(uNoiseTexture, gl_PointCoord + uTime * .0001 + vRandCorePosition.x).r * 0.1,
            gl_PointCoord.y + texture2D(uNoiseTexture, gl_PointCoord + uTime * .0001 + vRandCorePosition.x).r * 0.1
        );

    float strength = 0.1 / abs(distance(noiseUv, vec2(0.5)) - .25);
    //Replace the center by a random noise to make the center cell move
    // float strength = 0.15 / (distance(vec2(gl_PointCoord.x, (gl_PointCoord.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(gl_PointCoord.y, (gl_PointCoord.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
    strength *= 0.015 / abs(distance(gl_PointCoord, vec2(.5 + vRandCorePosition.x, .5 + vRandCorePosition.y)));
    gl_FragColor = vec4(vec3(strength * .1), 1.0);
    // gl_FragColor = vec4(gl_PointCoord.y);
}
