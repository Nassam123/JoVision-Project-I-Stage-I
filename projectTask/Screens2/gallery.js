import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, RefreshControl } from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";


const GalleryScreen = () => {
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const photos = await CameraRoll.getPhotos({ first: 20, assetType: 'All' });
      setImages(photos.edges.map(edge => edge.node.image.uri));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchImages();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
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
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default GalleryScreen;