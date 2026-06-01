varying vec2 vUv;

void main() {
    gl_Position = vec4(position, 1.);
    vUv = position.xy * 0.5 + 0.5;
}
