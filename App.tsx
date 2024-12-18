import { useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import Slider from '@react-native-community/slider';
import {
  Button, 
  ImageViewer, 
  CircleButton, 
  IconButton, 
  EmojiPicker, 
  EmojiList, 
  EmojiSticker,
  Saturate
} from './components';

const PlaceholderImage = require('./assets/images/background-image.png');


export default function App() {
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState('https://i.imgur.com/uTP9Xfr.jpg');
  
  const [brightness, setBrightness] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [contrast, setContrast] = useState(1);

  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View | null>  (null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("Você não escolheu uma imagem!");
    }
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  }

  const onModalClose = () =>{
    setIsModalVisible(false);
  }

  const onReset = () =>{
    setShowAppOptions(false);
    setSelectedImage('https://i.imgur.com/uTP9Xfr.jpg');
    setBrightness(1);
    setSaturation(1);
    setContrast(1);
  }

  const onSaveImageAsync = async() =>{
    if(status === null || status.granted === false){
      const { status: newStatus } = await requestPermission();
      if (newStatus !== 'granted'){
        alert('É necessário permissão, conceda permissão de salvar a imagem no dispositivo',)
        return;
      }
    }
    try{
      const localUri = await captureRef(imageRef, {
        height: 400,
        quality: 1,
      })

      await MediaLibrary.saveToLibraryAsync(localUri);
      if(localUri){
        alert('Imagem salva!');
      }
    } catch(error){
      console.log(error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View ref={imageRef} style={styles.imageContainer}>

        <View collapsable={false}>
            <Saturate
            contrast={contrast}
            saturation={saturation}
            brightness={brightness}
            >
              {selectedImage}
            </Saturate>
          {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/> : null}
        </View>

      </View>
      {showAppOptions?(
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Brilho: {brightness.toFixed(1)}  </Text>
            <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={2}
            value={brightness}
            onValueChange={setBrightness}
            />

            <Text style={styles.sliderLabel}>Saturação: {saturation.toFixed(1)} </Text>
            <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={2}
            value={saturation}
            onValueChange={setSaturation}
            />

            <Text style={styles.sliderLabel}>Contraste: {contrast.toFixed(1)}  </Text>
            <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={2}
            value={contrast}
            onValueChange={setContrast}
            />

          </View>
        </View>
      ):(
        <View style = {styles.footerContainer}>
          <Button theme="primary" label="Escolher uma foto" onPress={pickImageAsync} />
          <Button theme="primary" label="Usar essa foto" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#25292e',
     alignItems: 'center',
   },
   imageContainer: {
    alignItems: 'center',
    padding: 50,
   },
  footerContainer: {
    alignItems: 'center',
    marginTop: '70%',
    padding: 50,
    gap: 20,
  },
  optionsContainer: {
    marginTop: '70%',
    alignItems: 'center',
  },
   optionsRow: {
     alignItems: 'center',
     flexDirection: 'row',
   },
  sliderContainer: {
    marginTop: '15%',
    alignItems: 'center',
  },
  slider: {
    width: 300,
    height: 40,
  },
  sliderLabel: {
    color: '#fff',
  },
  //  image: {
  //    width: 320,
  //    height: 440,
  //    borderRadius: 18
  //  },
});