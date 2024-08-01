import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from './permissions';

const SensorsScreen = () => {
  const [location, setLocation] = useState(null);
  const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
  const [hasPermission, setHasPermission] = useState(false);

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
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude,
              speed: position.coords.speed,
            });
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
      });

      return () => {
        clearInterval(locationInterval);
        subscription.unsubscribe();
      };
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
});

export default SensorsScreen;
