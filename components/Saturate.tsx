import { Shaders, Node, GLSL} from 'gl-react';
import { Surface } from "gl-react-dom";
const shaders = Shaders.create({
  Saturate: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D t;
      uniform float contrast, saturation, brightness;
      const vec3 L = vec3(0.2125, 0.7254, 0.0721);
      void main(){
        vec4 c = texture2D(t, uv);
        vec3 brt = c.rgb * brightness;
        gl_FragColor = vec4(mix(
          vec3(0.5),
          mix(vec3(dot(brt, L)), brt, saturation),
          contrast), c.a);
      }
    `,
  },
});

interface SaturateProps{
  estilo: any
  contrast: number,
  saturation: number,
  brightness: number,
  children: React.ReactNode
}

const Saturate = ({ estilo, contrast, saturation, brightness, children }: SaturateProps) => (
  <Surface width={estilo.width} height={estilo.height}>
    <Node shader={shaders.Saturate} uniforms={{ contrast, saturation, brightness, t: children }} />
  </Surface>
);

export default Saturate;
