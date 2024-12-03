import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
} from 'react-native';
import {AdManager} from 'react-native-google-ads-admob';
import {AdView} from './src/AdView';
import List from './src/List';
import {routes} from './src/utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const App = () => {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const res = await AdManager.setRequestConfiguration({
        testDeviceIds: ['9556a25b632ea4ca'],
      });

      // console.log('setRequestConfiguration', JSON.stringify(res, null, 2));

      const isTest = await AdManager.isTestDevice();
      const test = await AdManager.getDeviceId();
      console.log('isTestDevice', test, isTest);

      setLoading(false);
    };

    init();
  }, []);

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
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
          paddingHorizontal: 6,
          marginBottom: 10,
          width: '100%',
        }}>
        {currentRoute && (
          <TouchableOpacity
            onPress={() => setCurrentRoute(null)}
            activeOpacity={0.8}
            style={{
              width: 50,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              borderRadius: 100,
            }}>
            <Icon name="arrow-left" color="black" size={28} />
          </TouchableOpacity>
        )}
      </View>

      {!loading && !currentRoute && (
        <View
          style={{
            alignItems: 'center',
            width: '100%',
          }}>
          <View
            style={{
              alignItems: 'center',
              marginBottom: 50,
            }}>
            <Text
              style={{
                fontSize: 18,
                letterSpacing: 1,
                textAlign: 'center',
              }}>
              Admob Native Advanced Ads {'\n'} for React Native
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setCurrentRoute(routes[0])}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'orange',
              width: '90%',
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginBottom: 5,
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Simple Banner Ad
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentRoute(routes[1])}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'orange',
              width: '90%',
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginBottom: 5,
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Ad with Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentRoute(routes[2])}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'orange',
              width: '90%',
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginBottom: 5,
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Ad with Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentRoute(routes[3])}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'orange',
              width: '90%',
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              borderRadius: 5,
              marginBottom: 5,
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Multiple Ads in a List
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => AdManager.openAdInspector()}
        activeOpacity={0.8}
        style={{
          width: '90%',
          alignItems: 'center',
          height: 50,
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: 'red',
        }}>
        <Text style={{color: 'white'}}>openAdInspector</Text>
      </TouchableOpacity>

      {currentRoute?.type === 'banner' && (
        <>
          <AdView
            type="image"
            media={false}
            unitId="ca-app-pub-5904408074441373/3241660524"
          />
        </>
      )}

      {currentRoute?.type === 'image' && (
        <View
          style={{
            height: 400,
          }}>
          <AdView
            type="image"
            media={true}
            unitId="ca-app-pub-5904408074441373/3241660524"
          />
        </View>
      )}

      {currentRoute?.type === 'video' && (
        <View
          style={{
            height: 400,
          }}>
          <AdView
            type="video"
            media={true}
            unitId="ca-app-pub-3940256099942544/1044960115"
          />
        </View>
      )}

      {currentRoute?.type === 'list' && <List />}
    </SafeAreaView>
  );
};

export default App;
