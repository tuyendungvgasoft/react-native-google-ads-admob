import React from 'react';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';

const App3 = () => {
  return (
    <SafeAreaView
      style={{
        height: '100%',
        width: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          height: 50,
          paddingHorizontal: 6,
          marginBottom: 10,
          width: '100%',
          backgroundColor: 'pink',
        }}></View>
    </SafeAreaView>
  );
};

export default App3;