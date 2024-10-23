import { StyleSheet, Image, View } from 'react-native';

export default function ImageViewer({ placeholderImageSource, selectedImage, brightness, saturation }) {
  const imageSource = selectedImage ? { uri: selectedImage } : placeholderImageSource;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image}></Image>

      <View style={[
        styles.overlay, 
        {
          backgroundColor: `rgba(${brightness*10},${brightness*10},${brightness*10}, ${1 - brightness})`,
          opacity: saturation,
        }
        ]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 440,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
