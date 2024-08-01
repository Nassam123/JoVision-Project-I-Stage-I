import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { requestLocationPermission } from './permissions';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import car from "./resources/car.png";
import walk from "./resources/walking.png";
import sit from "./resources/sitting.png";
import map from "./resources/map.png";


const SensorsScreen = () => {
  const [location, setLocation] = useState(null);
  const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
  const [hasPermission, setHasPermission] = useState(false);
  const [speedImage, setSpeedImage] = useState(map);
  const [orientationText, setOrientationText] = useState("portrait");

  useEffect(() => {
    const getPermissionsAndData = async () => {
      const granted = await requestLocationPermission();
      setHasPermission(granted);

      if (!granted) {
        Alert.alert("Permission Denied");
        return;
      }

      const fetchLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, altitude, speed } = position.coords;
            console.log('Speed:', speed);
            setLocation({ latitude, longitude, altitude, speed });
            updateSpeedImage(speed);
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      };

      fetchLocation();
      const locationInterval = setInterval(fetchLocation, 10000);

      setUpdateIntervalForType(SensorTypes.accelerometer, 500);

      const subscription = accelerometer.subscribe(({ x, y, z }) => {
        setOrientation({ x, y, z });
        updateOrientationText(x, y, z);
      });

      return () => {
        clearInterval(locationInterval);
        subscription.unsubscribe();
      };
    };

    const updateSpeedImage = (speed) => {
      if (speed >= 15) {
        setSpeedImage(car);
      } else if (speed >= 5) {
        setSpeedImage(walk);
      } else if (speed < 5) {
        setSpeedImage(sit);
      }
    };

  
    const updateOrientationText = (x, y, z) => {
      const absX = Math.abs(x);
      const absY = Math.abs(y);
      const absZ = Math.abs(z);

      if (absZ > absX && absZ > absY) {
        if (z > 0) {
          setOrientationText("portrait");
        } else {
          setOrientationText("upsideDown"); 
        }
      } else if (absX > absY) {
        if (x > 0) {
          setOrientationText("landscapeRight"); 
        } else {
          setOrientationText("landscapeLeft"); 
        }
      } else {
        setOrientationText("portrait"); 
      }
    };

    getPermissionsAndData();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No location permission granted.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
      <Image source={speedImage} style={styles.image} />
      <Text style={styles.orientationText}>{orientationText}</Text>
      <Text style={styles.title}>Sensors</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Location:</Text>
        {location ? (
          <>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text>Altitude: {location.altitude}</Text>
            <Text>Speed: {location.speed}</Text>
          </>
        ) : (
          <Text>Loading location...</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Orientation:</Text>
        <Text>X: {orientation.x.toFixed(2)}</Text>
        <Text>Y: {orientation.y.toFixed(2)}</Text>
        <Text>Z: {orientation.z.toFixed(2)}</Text>
      </View>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  orientationText: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default SensorsScreen;
