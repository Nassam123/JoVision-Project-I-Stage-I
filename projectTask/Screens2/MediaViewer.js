import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import Video from 'react-native-video';

const MediaViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, mediaList = [], initialIndex = 0 } = route.params;

  const [media, setMedia] = useState(item);
  const [index, setIndex] = useState(initialIndex);
  const videoRef = useRef(null);

  const isVideo = (type) => type && type.startsWith('video/');

  useEffect(() => {
    if (mediaList.length > 0) {
      setMedia(mediaList[index]);
    }
  }, [index, mediaList]);

  useEffect(() => {
    if (isVideo(media.type) && videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [media]);

  const handlePlayPause = () => {
    setMedia((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleForward = () => {
    if (videoRef.current && media.currentTime != null) {
      videoRef.current.seek(media.currentTime + 5);
    }
  };

  const handleRewind = () => {
    if (videoRef.current && media.currentTime != null) {
      videoRef.current.seek(media.currentTime - 5);
    }
  };

  const handleNext = () => {
    if (mediaList.length > 0) {
      setIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
    }
  };

  const handlePrevious = () => {
    if (mediaList.length > 0) {
      setIndex((prevIndex) => (prevIndex - 1 + mediaList.length) % mediaList.length);
    }
  };

  return (
    <View style={styles.container}>
      {isVideo(media.type)  ? (
        <Video
          ref={videoRef}
          source={{ uri: media.image.uri }}
          style={styles.media}
          controls={true}
          paused={!media.isPlaying}
          onProgress={(data) => setMedia((prev) => ({ ...prev, currentTime: data.currentTime }))}
        />
      ) : (
        <Image source={{ uri: media.image.uri }} style={styles.media} />
      )}
      <View style={styles.controls}>
        {isVideo(media.type)  && (
          <>
            <Button title={media.isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
            <Button title="Forward" onPress={handleForward} />
            <Button title="Rewind" onPress={handleRewind} />
          </>
        )}
        <Button title="Previous" onPress={handlePrevious} />
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '80%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default MediaViewerScreen;
