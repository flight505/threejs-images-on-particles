uniform float uPointSize;
uniform float uProgress;
uniform float uTime;
uniform sampler2D uTouch;
uniform float uNbLines;
uniform float uNbColumns;
uniform float uScaleHeightPointSize;
uniform float uWaveFrequency;

attribute vec3 initPosition;

varying vec2 vTexCoords;

const float scale = 1.0;
const float waveAmplitude = 5.;

void main() {
  // shunk of code used in Three.js
  // https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/begin_vertex.glsl.js
  #include <begin_vertex>

  // appear effect
  transformed = initPosition + ((position - initPosition) * uProgress);

  // flag effect
  transformed.z += sin(transformed.x * uWaveFrequency + uTime) * waveAmplitude;
  transformed.z += sin(transformed.y * uWaveFrequency + uTime) * waveAmplitude;

  // get UVs of the plane
  vec2 vUv = transformed.xy / vec2(uNbLines, uNbColumns) - vec2(-0.5, -0.5);

  // get Touch canvas texture
  float touch = texture2D(uTouch, vUv).r;
  // apply the touch canvas texture on the Z axis of the particles
  // (if touch texture is white, apply force, if black do nothing)
  transformed.z += touch * 40.;

  // https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/project_vertex.glsl.js
	#include <project_vertex>

  // get Texture coords for fragment shader
  vTexCoords = position.xy;

  // Final Position
  gl_PointSize = uPointSize * ( uScaleHeightPointSize / - mvPosition.z );
}
