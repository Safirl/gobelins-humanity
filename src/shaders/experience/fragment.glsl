varying vec2 vUv;
uniform sampler2D uFigureTexture;
uniform sampler2D uPositionTexture;
uniform int uCellCount;

void main()
{
    vec4 textureColor = texture2D(uFigureTexture, vUv);
    if (textureColor.r > .1) discard;
    // vec2 wavedUv = vec2(
    //         vUv.x + sin(vUv.y * 30.0) * 0.1,
    //         vUv.y + sin(vUv.x * 30.0) * 0.1
    //     );
    // // float strength = step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // float strength = step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.);
    //
    float minDist = 999.;
    for (int i = 0; i < uCellCount; i++) {
        float tx = (float(i) + .5) / float(uCellCount);
        vec2 cellPos = texture2D(uPositionTexture, vec2(tx, .5)).rg;

        float d = distance(vUv, cellPos);
        if (d < minDist) minDist = d;
    }
    float circle = step(minDist, 0.01);
    float strength = step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25));
    gl_FragColor = vec4(vec3(circle), 1.);
}
