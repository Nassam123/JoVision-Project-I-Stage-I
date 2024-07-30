import React from "react";
import { View , StyleSheet} from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import cameraScreen from "./CameraScreen/code";


const Tab = createBottomTabNavigator();

const Stage1 = () => {
  return (
    <View style={styles.container}>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Camera">
        <Tab.Screen name="Camera" component={cameraScreen} />
    
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

