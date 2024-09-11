uniform vec3 uColor;
uniform sampler2D uTexture;
uniform float uNbLines;
uniform float uNbColumns;
uniform float uProgress;

varying vec2 vTexCoords;

// create a circle value in a frag shader
float circle(vec2 uv, float border) {
	float radius = 0.5;
	float dist = radius - distance(uv, vec2(0.5));
  return smoothstep(0.0, border, dist);
}

void main() {
  // adapt point to UV texture

  // We get the coordinate inside 1 particle: gl_PointCoord
  vec2 uv = gl_PointCoord;
  //  We invert the V because it's inverted by default when using gl_PointCoord compare to classic UVs.
  uv.y *= -1.;
  // we divide U by the number of particles in a line
  // we divide V by the number of particles in a column
  // so the final result is between 0 and 1.
  uv /= vec2(uNbLines, uNbColumns);

  // After dividing a UV you need to offset it using +
  // we add X the position of the particule divided by the total
  // example, if 100 particles the 10th particle will be 0.1
  float texOffsetU = vTexCoords.x / uNbLines;
  // same for Y
  float texOffsetV = vTexCoords.y / uNbColumns;
  uv += vec2(texOffsetU, texOffsetV);
  // Finally we add 0.5 to center the value
  uv += vec2(0.5);

  vec4 texture = texture2D(uTexture, uv);

  gl_FragColor.rgb = texture.rgb;

  // discard pixels if too dark
  if (gl_FragColor.r < 0.1) {
    discard;
  }

  gl_FragColor.a = 1.;
  // make an circle opacity to create round particles
  gl_FragColor.a *= circle(gl_PointCoord, 0.2);
  // apply opacity on the appear effect as well
  gl_FragColor.a *= uProgress;
}