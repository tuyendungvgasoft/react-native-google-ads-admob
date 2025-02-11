/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App'; //Test react-native-google-mobile-ads
import App from './App2'; //Test native-ads
import {name as appName} from './app.json';
import {AdManager, TestIds} from 'react-native-google-ads-admob';

AdManager.registerRepository({
  name: 'imageAd',
  adUnitId: TestIds.Image,
  numOfAds: 3,
  nonPersonalizedAdsOnly: false,
  videoOptions: {
    mute: false,
  },
  expirationPeriod: 3600000, // in milliseconds (optional)
  mediationEnabled: false,
}).then(result => {
  console.log('registered: ', result);
});

AdManager.registerRepository({
  name: 'videoAd',
  adUnitId: TestIds.Video,
  numOfAds: 3,
  nonPersonalizedAdsOnly: false,
  videoOptions: {
    mute: false,
  },
  expirationPeriod: 3600000, // in milliseconds (optional)
  mediationEnabled: false,
}).then(result => {
  console.log('registered: ', result);
});

AppRegistry.registerComponent(appName, () => App);
