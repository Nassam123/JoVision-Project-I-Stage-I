import React from "react";
import { View , StyleSheet, Text} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import CameraScreen from "./camera/code";
import SensorsScreen from "./sensors/code";
import GalleryScreen from "./gallery";
import MediaViewerScreen from "./MediaViewer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Stage2 = () => {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Tab.Navigator >
      <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Sensors" component={SensorsScreen} />
        <Tab.Screen name="Gallery" component={GalleryStack} />
        
        </Tab.Navigator>
    </NavigationContainer>
    </View>
  );
}

const GalleryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
      <Stack.Screen name="MediaViewerScreen" component={MediaViewerScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Stage2;

const styles = StyleSheet.create({
    container: {
      flex: 1,width:'100%',
    },
  });

