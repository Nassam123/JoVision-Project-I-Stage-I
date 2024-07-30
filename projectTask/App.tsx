import React, { Component } from 'react';
import {StyleSheet,View , Text , Button} from 'react-native';
import Stage1 from './Screens/Stage1';


export default class App extends Component {
 

    render() {
        return (
    
      <View style = {style.containers}>

        <Stage1></Stage1>

        </View>
    
     
      );
    }
}

    
const style = StyleSheet.create({
  containers: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});