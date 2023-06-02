import React, { useState, useEffect } from 'react';
import { View, Button, Alert, PermissionsAndroid, Platform, Image } from 'react-native';
import { launchCamera, CameraOptions } from 'react-native-image-picker/src'
import RNFS from 'react-native-fs';
import { PERMISSIONS, request } from 'react-native-permissions';

const App = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    // Solicitar permisos de cámara y sistema de archivos
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA, {
          title: 'Permiso de Cámara',
          message: 'Esta aplicación necesita acceso a tu cámara.',
          buttonPositive: 'Aceptar',
          buttonNegative: 'Cancelar',
        });
  
        if (cameraPermission === 'granted') {
          console.log('Permiso de cámara concedido');
        } else {
          console.log('Permiso de cámara denegado');
        }
      } else {
        console.log('No es un dispositivo Android');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const takePhoto = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: false,
    };

    launchCamera(options, (response: any) => {
      if (response.didCancel) {
        console.log('Se canceló la captura de imagen');
      } else if (response.errorMessage) {
        console.log('Error al tomar la foto:', response.errorMessage);
      } else {
        //const { uri } = response; 
        const { uri } = response.assets[0];
        console.log("uri:");
        console.log(uri);
        //console.log(uri);
        savePhoto(uri);
      }
    });
  };

  const savePhoto = async (uri: string) => {
    try {
      if (!uri) {
        console.log('URI de imagen no definido');
        return;
      }
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
  
      const folderPath = `${RNFS.PicturesDirectoryPath}/photo-app/${year}/${month}/${day}`;
      const folderExists = await RNFS.exists(folderPath);
  
      if (!folderExists) {
        await RNFS.mkdir(folderPath, { NSURLIsExcludedFromBackupKey: true });
      }
  
      const fileName = `${year}-${month}-${day}-${date.getTime()}.jpg`;
      const destPath = `${folderPath}/${fileName}`;
  
      const fileExists = await RNFS.exists(uri);
  
      if (fileExists) {
        await RNFS.moveFile(uri, destPath);
        setImageUri(destPath);
        console.log('Imagen guardada:', destPath);
      } else {
        console.warn('La imagen no existe en la ubicación original');
      }
    } catch (err) {
      console.warn('Error al guardar la imagen:', err);
    }
  };
  

  return (
    <View>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <Button title="Tomar Foto" onPress={takePhoto} />
    </View>
  );
};

export default App;
