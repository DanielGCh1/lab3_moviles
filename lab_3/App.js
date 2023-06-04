import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './components/styles';

export default function App() {
  let cameraRef = useRef();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [showCamera, setShowCamera] = useState(false);
  const [photosList, setPhotosList] = useState([]);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const openCamera = () => {
    setShowCamera(true);
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const mediaResult = await MediaLibrary.getAssetsAsync({
      mediaType: ['photo'],
      first: 200,
    });
    setPhotosList(mediaResult.assets);
  };

  const goBack = () => {
    setPhoto(undefined);
    setShowCamera(false);
    setPhotosList([]);
  };

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    savePhoto(newPhoto);
  };

  let savePhoto = async (photo) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);

      const folderPath = `photo-app/${year}/${month}/${day}`;

      await MediaLibrary.createAssetAsync(photo.uri)
        .then(asset => {
          MediaLibrary.createAlbumAsync(folderPath, asset)
            .then(() => {
              setPhoto(undefined);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCameraType = () => {
    setCameraType(prevCameraType => {
      return prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back;
    });
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#5399C9" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <Camera style={styles.cameraContainer} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonCameraContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePic} />
          </View>
          <TouchableOpacity style={styles.goBackButtonCamera} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#5399C9" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleCameraButton} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse" size={30} color="#fff" />
          </TouchableOpacity>
        </Camera>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  if (photosList.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.photosContainer}>
          {photosList.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => setPhoto(item)}>
              <Image style={styles.thumbnail} source={{ uri: item.uri }} />
            </TouchableOpacity>

          ))}
        </ScrollView>
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#5399C9" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CAMG2</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Laboratorio #3</Text>
        <Text style={styles.infoTextSub}>Integrantes:</Text>
        <Text style={styles.infoTextSub}>Natalia Rojas</Text>
        <Text style={styles.infoTextSub}>Libny Gómez</Text>
        <Text style={styles.infoTextSub}>Diego Jiménez</Text>
        <Text style={styles.infoTextSub}>Daniel Gómez</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
          <Ionicons name="camera" size={50} color="#fff" />
          <Text style={styles.buttonText}>Cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
          <Ionicons name="images" size={50} color="#fff" />
          <Text style={styles.buttonText}>Galería</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}