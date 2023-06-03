import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const screenWidth = Dimensions.get('window').width;
const photoSize = screenWidth / 3 - 10; // Resta 10 para tener en cuenta los márgenes

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [showCamera, setShowCamera] = useState(false);
  const [photosList, setPhotosList] = useState([]);
  const [numColumns, setNumColumns] = useState(3);

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
      first: 20,
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

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <Camera style={styles.cameraContainer} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePic} />
          </View>
          <TouchableOpacity style={styles.goBackButtonCamera} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
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
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
        <Ionicons name="images" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  preview: {
    flex: 1,
    alignSelf: 'stretch',
  },
  thumbnail: {
    width: photoSize,
    height: photoSize,
    margin: 5,
  },
  cameraButton: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 50,
    marginBottom: 10,
  },
  galleryButton: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 50,
  },
  goBackButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#000',
    borderRadius: 5,
    zIndex: 1,
  },
  goBackButtonCamera: {
    position: 'absolute',
    top: 30,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#000',
    borderRadius: 5,
    zIndex: 1,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Ajusta aquí para mostrar la última fila en el lado izquierdo
    marginTop: 70,
    paddingBottom: 70, // Agrega un paddingBottom para mostrar la última fila completa
  },
});

