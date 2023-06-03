import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [showCamera, setShowCamera] = useState(false);

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

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }

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
    console.log('photo si esta');
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <TouchableOpacity style={styles.saveButton} onPress={() => savePhoto(photo)}>
          <Ionicons name="save" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.discardButton} onPress={() => setPhoto(undefined)}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  else{
    console.log('photo no esta');
  }

  if (showCamera) {
    return (
      <Camera style={styles.container} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePic} />
        </View>
        <StatusBar style="auto" />
        <TouchableOpacity style={styles.discardButton} onPress={() => setShowCamera(false)}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </Camera>
    );
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Ionicons name="camera" size={24} color="#fff" />
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
  preview: {
    flex: 1,
    alignSelf: 'stretch',
  },
  saveButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  discardButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  cameraButton: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 50,
  },
});

