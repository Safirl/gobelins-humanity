varying vec2 vUv;
varying vec3 vRandCorePosition;
uniform float uSize;

void main() {
    // float strength = 0.015 / (distance(vUv, vec2(0.5)));
    // float strength = 1.0 - step(0.01, abs(distance(gl_PointCoord, vec2(0.5)) - .45));
    float strength = 0.01 / abs(distance(gl_PointCoord, vec2(0.5)) - .45);
    //Replace the center by a random noise to make the center cell move
    strength += 0.015 / (distance(gl_PointCoord, vec2(vRandCorePosition.x, vRandCorePosition.y)));
    gl_FragColor = vec4(vec3(strength), 1.0);
    // gl_FragColor = vec4(gl_PointCoord.y);
}
