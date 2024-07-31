import React from "react";
import { View , StyleSheet} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import cameraScreen from "./camera/code";
import SensorsScreen from "./sensors/code";
import GalleryScreen from "./gallery";


const Tab = createBottomTabNavigator();

const Stage1 = () => {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Camera">
        <Tab.Screen name="Camera" component={cameraScreen} />
        <Tab.Screen name="Sensors" component={SensorsScreen} />
        <Tab.Screen name="Gallery" component={GalleryScreen} />
    
      </Tab.Navigator>
    </NavigationContainer>
    </View>
  );
}

export default Stage1;

const styles = StyleSheet.create({
    container: {
      flex: 1,width:'100%',
    },
  });

