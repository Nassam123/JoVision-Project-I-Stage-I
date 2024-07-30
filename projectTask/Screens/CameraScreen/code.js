import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View, Alert } from 'react-native';
import { Camera, useCameraDevice  } from 'react-native-vision-camera';
import CameraRoll from "@react-native-camera-roll/camera-roll";
import { requestCameraPermission } from './permissions'; // Adjust the import based on your file structure

const CameraScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    const getPermission = async () => {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
      if (!granted) {
        Alert.alert("Permission Denied", "Camera access is required to take photos.");
      }
    };
    getPermission();
  }, []);
  const savePhoto = async () => {
    if (photo) {
      await CameraRoll.save(`file://${photo}`, { type: 'photo' });
      setPhoto(null);
    }
  };

  const discardPhoto = () => {
    setPhoto(null);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto();
        setPhoto(photo.path);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device found.</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Waiting for camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: `file://${photo}` }} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={savePhoto} />
            <Button title="Discard" onPress={discardPhoto} />
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
            key={device.id}
          />
          <Button title="Take Picture" onPress={takePicture} style={styles.captureButton} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
});

export default CameraScreen;
