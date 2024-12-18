import { Shaders, Node, GLSL} from 'gl-react';
import { Surface } from 'gl-react-dom';
import { StyleSheet, Image} from 'react-native';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

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
  contrast: number,
  saturation: number,
  brightness: number,
  children: React.ReactNode
}



const Saturate = ({contrast, saturation, brightness, children }: SaturateProps) => (
  <Surface width={styles.image.width} height={styles.image.height}>
    <Node shader={shaders.Saturate} uniforms={{ contrast, saturation, brightness, t: children }} />
  </Surface>
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '300%',
  }
}
)

export default Saturate;

/* Versão que "FUNCIONARIA" no mobile */

/* interface SaturateProps {
  contrast: number,
  saturation: number,
  brightness: number,
  children: any
}

const Saturate = ({ contrast, saturation, brightness, children }: SaturateProps) => (
  <Surface style={{ width: 320, height: 320 }}>
    <Node shader={shaders.Saturate} uniforms={{ contrast, saturation, brightness, t: children }} />
  </Surface>
);

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 320,
  }
});

export default Saturate; */