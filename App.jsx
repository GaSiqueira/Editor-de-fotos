import { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { Share } from 'react-native';
import Slider from '@react-native-community/slider';
import {
  Button, 
  ImageViewer, 
  CircleButton, 
  IconButton, 
  EmojiPicker, 
  EmojiList, 
  EmojiSticker
} from './components';

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [brightness, setBrightness] = useState(1);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
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
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage('');
    setBrightness(1);
  };

  const shareImage = async () => {
    if (!selectedImage) {
      alert('Selecione uma imagem antes de compartilhar.');
      return;
    }
  
    try {
      await Share.share({
        title: 'Compartilhar imagem',
        message: 'Veja essa imagem incrível!',
        url: selectedImage,
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  const onSaveImageAsync = async () => {
    if (status === null || status.granted === false) {
      const { status: newStatus } = await requestPermission();
      if (newStatus !== 'granted') {
        alert('É necessário permissão, conceda permissão de salvar a imagem no dispositivo');
        return;
      }
    }
    try {
      const localUri = await captureRef(imageRef, {
        height: 400,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Imagem salva!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
            brightness={brightness}
          />
          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Brilho: {brightness.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              value={brightness}
              onValueChange={setBrightness}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
            />
          </View>
          <View style={styles.containerCompartilhar}>
            <Button theme="primary" label="Compartilhar" onPress={shareImage} disabled={!selectedImage} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Escolher uma foto" onPress={pickImageAsync} />
          <Button theme="primary" label="Usar essa foto" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
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
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  containerCompartilhar: {
    alignItems: 'center',
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 30,
  },
  sliderContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  slider: {
    width: 300,
    height: 40,
  },
  sliderLabel: {
    color: '#fff',
    marginBottom: 10,
  },
});