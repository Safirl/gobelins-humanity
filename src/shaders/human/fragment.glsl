varying vec2 vUv;
uniform sampler2D uFigureTexture;

void main()
{
    vec4 color = texture2D(uFigureTexture, vUv);
    gl_FragColor = color;
}
