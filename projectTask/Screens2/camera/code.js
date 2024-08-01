import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View, Alert } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { requestCameraPermission } from './permissions';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';

const CameraScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState('photo');
  const [type, setType] = useState('back');
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const device = useCameraDevice(type);

  useEffect(() => {
    const getPermission = async () => {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
      if (!granted) {
        Alert.alert("Permission Denied");
      }
    };
    getPermission();
  }, []);

  const save = async (file, mode) => {
    if (file) {
      try {
        const savedUri = await CameraRoll.save(`file://${file}`, { type: mode });
        Alert.alert("Saved");
        mode === 'video' ? setVideo(null) : setPhoto(null);
      } catch (error) {
        console.error('Error saving', error);
        Alert.alert("Save Failed");
      }
    }
  };

  const discard = (mode) => {
    mode === 'video' ? setVideo(null) : setPhoto(null);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto();
        const newPath = `${RNFS.DocumentDirectoryPath}/nassam_${new Date().toISOString()}.jpg`; 
        await RNFS.moveFile(photo.path, newPath); 
        setPhoto(newPath); 
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert("Capture Failed");
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        await cameraRef.current.startRecording({
          onRecordingFinished: async (video) => {
            const newPath = `${RNFS.DocumentDirectoryPath}/nassam_${new Date().toISOString()}.mp4`; 
            await RNFS.moveFile(video.path, newPath); 
            setVideo(newPath); 
            setIsRecording(false);
          },
          onRecordingError: (error) => {
            console.error('Recording error:', error);
            Alert.alert("Recording Failed");
            setIsRecording(false);
          }
        });
      } catch (error) {
        console.error('Error starting recording:', error);
        Alert.alert("Recording Failed");
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        Alert.alert("Stop Recording Failed");
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
            <Button title="Save" onPress={() => save(photo, 'photo')} />
            <Button title="Discard" onPress={() => discard('photo')} />
          </View>
        </View>
      ) : video ? (
        <View style={styles.previewContainer}>
          <Video source={{ uri: `file://${video}` }} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={() => save(video, 'video')} />
            <Button title="Discard" onPress={() => discard('video')} />
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={mode === 'photo'}
            video={mode === 'video'}
            key={device.id}
          />
          <View style={styles.controlContainer}>
            <Button title="Switch Camera" onPress={() => setType(type === 'back' ? 'front' : 'back')} />
            <Button title={`Switch to ${mode === 'photo' ? 'Video' : 'Photo'} Mode`} onPress={() => setMode(mode === 'photo' ? 'video' : 'photo')} />
            <Button
              title={mode === 'photo' ? "Take Picture" : isRecording ? "Stop Recording" : "Start Recording"}
              onPress={mode === 'photo' ? takePicture : isRecording ? stopRecording : startRecording}
            />
          </View>
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
  controlContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default CameraScreen;
