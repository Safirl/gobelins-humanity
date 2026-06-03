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
    vec2 nucleusCenter = vec2(0.5) + vRandCorePosition.xy + vec2(
                sin(uTime * 0.001 + vRandCorePosition.x) * 0.06,
                cos(uTime * 0.002 + vRandCorePosition.y) * 0.06
            );
    strength *= 0.015 / abs(distance(gl_PointCoord, nucleusCenter));
    gl_FragColor = vec4(vec3(strength * .1), 1.0);
    // gl_FragColor = vec4(gl_PointCoord.y);
}
