import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, RefreshControl, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const GalleryScreen = () => {
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newName, setNewName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const photos = await CameraRoll.getPhotos({ first: 20, assetType: 'All' });
      setImages(photos.edges.map(edge => edge.node));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchImages();
    setRefreshing(false);
  };

  const renameImage = async () => {
    if (!selectedImage) return;
    
    const oldPath = selectedImage.image.uri;
    const fileInfo = await RNFS.stat(oldPath);
    const extension = fileInfo.originalFilepath.split('.').pop();
    const newPath = `${RNFS.PicturesDirectoryPath}/${newName}.${extension}`;
    

    try {
      await RNFS.moveFile(fileInfo.originalFilepath, newPath);
      fetchImages();
      setModalVisible(false);
      Alert.alert('Success');
    } catch (error) {
      console.error('Error :', error);
      Alert.alert('Failed');
    }
  };

  const deleteImage = async (uri) => {
    const fileInfo = await RNFS.stat(uri);
    try {
      await RNFS.unlink(fileInfo.originalFilepath);
      fetchImages();
      Alert.alert('Success');
    } catch (error) {
      console.error('Error ', error);
      Alert.alert('Error');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => setSelectedImage(item)}>
      <Image source={{ uri: item.image.uri }} style={styles.image} />
      {selectedImage && selectedImage.image.uri === item.image.uri && (
        <View style={styles.overlay}>
          <Button title="Rename" onPress={() => setModalVisible(true)} />
          <Button title="Delete" onPress={() => deleteImage(item.image.uri)} />
          <Button title="FullScreen" onPress={() =>  navigation.navigate('MediaViewerScreen', { 
                 item: item,
                mediaList: images, 
                initialIndex: images.indexOf(item)  
              })
            }
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
            />
            <Button title="Rename" onPress={renameImage} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default GalleryScreen;
