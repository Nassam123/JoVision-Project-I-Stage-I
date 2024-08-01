import React from "react";
import { View , StyleSheet, Text} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import CameraScreen from "./camera/code";
import SensorsScreen from "./sensors/code";
import GalleryScreen from "./gallery";
import SlideshowScreen from "./slideshow";


const Tab = createBottomTabNavigator();

const Stage2 = () => {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Tab.Navigator >
      <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Sensors" component={SensorsScreen} />
        <Tab.Screen name="Gallery" component={GalleryScreen} />
        <Tab.Screen name="Slideshow" component={SlideshowScreen} />
        </Tab.Navigator>
    </NavigationContainer>
    </View>
  );
}

export default Stage2;

const styles = StyleSheet.create({
    container: {
      flex: 1,width:'100%',
    },
  });

