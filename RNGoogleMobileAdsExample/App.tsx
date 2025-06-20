import React, {useEffect, useRef} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Test, TestRegistry, TestResult, TestRunner, TestType} from 'jet';

import MobileAds, {
  type PaidEvent,
  AdEventType,
  AdsConsent,
  AdsConsentDebugGeography,
  AppOpenAd,
  InterstitialAd,
  TestIds,
  BannerAd,
  BannerAdSize,
  GAMBannerAdSize,
  RevenuePrecisions,
  RewardedAd,
  RewardedAdEventType,
  useInterstitialAd,
  useAppOpenAd,
  useRewardedAd,
  GAMInterstitialAd,
  GAMAdEventType,
  GAMBannerAd,
  RewardedInterstitialAd,
  useRewardedInterstitialAd,
} from 'react-native-google-ads-admob';
import {requestTrackingPermission} from 'react-native-tracking-transparency';

const appOpen = AppOpenAd.createForAdRequest(TestIds.APP_OPEN, {
  requestNonPersonalizedAdsOnly: true,
});

class AppOpenTest implements Test {
  adListener: () => void;
  adLoaded = false;

  constructor() {
    // Current no way in jet-next to re-render on async completion or to delay render? But still can log it
    this.adListener = appOpen.addAdEventsListener(({type, payload}) => {
      console.log(`${Platform.OS} app open ad event: ${type}`);
      if (type === AdEventType.ERROR) {
        console.log(`${Platform.OS} app open error: ${payload?.message}`);
      }
      if (type === AdEventType.PAID) {
        console.log(`${Platform.OS} app open paid:`, payload);
      }
      if (type === AdEventType.LOADED) {
        this.adLoaded = true;
      }
    });
  }

  getPath(): string {
    return 'AppOpen';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Load App Open Ad"
          onPress={() => {
            try {
              appOpen.load();
            } catch (e) {
              console.log(`${Platform.OS} app open load error: ${e}`);
            }
          }}
        />
        <Text>Loaded? {this.adLoaded ? 'true' : 'false'}</Text>
        <Button
          title="Show App Open Ad"
          onPress={() => {
            try {
              appOpen.show();
            } catch (e) {
              console.log(`${Platform.OS} app open show error: ${e}`);
            }
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
      this.adListener();
    }
  }
}

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  // requestNonPersonalizedAdsOnly: true,
  // keywords: ['fashion', 'clothing'],
});

// To implement a test you must make a new object implementing a specific interface.
class InterstitialTest implements Test {
  adListener: () => void;
  adLoaded = false;

  constructor() {
    // Current no way in jet-next to re-render on async completion or to delay render? But still can log it
    this.adListener = interstitial.addAdEventsListener(({type, payload}) => {
      console.log(`${Platform.OS} interstitial ad event: ${type}`);
      if (type === AdEventType.PAID) {
        console.log('Paid', payload);
      }
      if (type === AdEventType.ERROR) {
        console.log(`${Platform.OS} interstitial error: ${payload?.message}`);
      }
      if (type === AdEventType.PAID) {
        console.log(`${Platform.OS} app open paid:`, payload);
      }
      if (type === AdEventType.LOADED) {
        this.adLoaded = true;
      }
    });
  }

  getPath(): string {
    return 'Interstitial';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Load Interstitial"
          onPress={() => {
            try {
              interstitial.load();
            } catch (e) {
              console.log(`${Platform.OS} interstitial load error: ${e}`);
            }
          }}
        />
        <Text>Loaded? {this.adLoaded ? 'true' : 'false'}</Text>
        <Button
          title="Show Interstitial"
          onPress={() => {
            try {
              interstitial.show();
            } catch (e) {
              console.log(`${Platform.OS} app open show error: ${e}`);
            }
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
      this.adListener();
    }
  }
}

class BannerTest implements Test {
  bannerAdSize: BannerAdSize | string;

  constructor(bannerAdSize) {
    this.bannerAdSize = bannerAdSize;
    this.bannerRef = React.createRef();
  }

  getPath(): string {
    return this.bannerAdSize
      .split('_')
      .map(
        s => s.toLowerCase().charAt(0).toUpperCase() + s.toLowerCase().slice(1),
      )
      .join('');
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View ref={onMount}>
        <BannerAd
          ref={this.bannerRef}
          unitId={
            this.bannerAdSize.includes('ADAPTIVE_BANNER')
              ? TestIds.ADAPTIVE_BANNER
              : TestIds.BANNER
          }
          size={this.bannerAdSize}
          onPaid={(event: PaidEvent) => {
            console.log(
              `Paid: ${event.value} ${event.currency} (precision ${event.precision}})`,
            );
            console.log('responseInfo', event.responseInfo);
          }}
        />
        <Button
          title="reload"
          onPress={() => {
            this.bannerRef.current?.load();
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

class CollapsibleBannerTest implements Test {
  getPath(): string {
    return 'CollapsibleBanner';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View ref={onMount}>
        <BannerAd
          unitId={TestIds.ADAPTIVE_BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            networkExtras: {
              collapsible: 'top',
            },
          }}
          onPaid={(event: PaidEvent) => {
            console.log(
              `Paid: ${event.value} ${event.currency} (precision ${event.precision}})`,
            );
            console.log('responseInfo', event.responseInfo);
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});
class RewardedTest implements Test {
  adListener: () => void;
  adLoaded = false;

  constructor() {
    // Current no way in jet-next to re-render on async completion or to delay render? But still can log it
    this.adListener = rewarded.addAdEventsListener(({type, payload}) => {
      console.log(`${Platform.OS} rewarded ad event: ${type}`);
      if (type === AdEventType.PAID) {
        console.log(payload);
      }
      if (type === AdEventType.ERROR) {
        console.log(
          `${Platform.OS} rewarded error: ${(payload as Error).message}`,
        );
      }
      if (type === RewardedAdEventType.LOADED) {
        console.log(`${Platform.OS} reward: ${JSON.stringify(payload)})`);
        this.adLoaded = true;
      }
    });
  }

  getPath(): string {
    return 'Rewarded';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Load Rewarded"
          onPress={() => {
            try {
              rewarded.load();
            } catch (e) {
              console.log(`${Platform.OS} rewarded load error: ${e}`);
            }
          }}
        />
        <Text>Loaded? {this.adLoaded ? 'true' : 'false'}</Text>
        <Button
          title="Show Rewarded"
          onPress={() => {
            try {
              rewarded.show();
            } catch (e) {
              console.log(`${Platform.OS} app open show error: ${e}`);
            }
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
      this.adListener();
    }
  }
}

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  TestIds.REWARDED_INTERSTITIAL,
  {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  },
);
class RewardedInterstitialTest implements Test {
  adListener: () => void;
  adLoaded = false;

  constructor() {
    // Current no way in jet-next to re-render on async completion or to delay render? But still can log it
    this.adListener = rewardedInterstitial.addAdEventsListener(
      ({type, payload}) => {
        console.log(`${Platform.OS} rewarded interstitial ad event: ${type}`);
        if (type === AdEventType.PAID) {
          console.log(payload);
        }
        if (type === AdEventType.ERROR) {
          console.log(
            `${Platform.OS} rewarded interstitial error: ${
              (payload as Error).message
            }`,
          );
        }
        if (type === RewardedAdEventType.LOADED) {
          console.log(`${Platform.OS} reward: ${JSON.stringify(payload)})`);
          this.adLoaded = true;
        }
      },
    );
  }

  getPath(): string {
    return 'RewardedInterstitial';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Load Rewarded Interstitial"
          onPress={() => {
            try {
              rewardedInterstitial.load();
            } catch (e) {
              console.log(
                `${Platform.OS} rewarded interstitial load error: ${e}`,
              );
            }
          }}
        />
        <Text>Loaded? {this.adLoaded ? 'true' : 'false'}</Text>
        <Button
          title="Show Rewarded Interstitial"
          onPress={() => {
            try {
              rewardedInterstitial.show();
            } catch (e) {
              console.log(`${Platform.OS} app open show error: ${e}`);
            }
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
      this.adListener();
    }
  }
}

class AdConsentTest implements Test {
  getPath(): string {
    return 'ConsentForm';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Show Consent Form"
          onPress={async () => {
            const consentInfo = await AdsConsent.requestInfoUpdate({
              debugGeography: AdsConsentDebugGeography.EEA,
              testDeviceIdentifiers: [],
            });

            if (consentInfo.isConsentFormAvailable) {
              await AdsConsent.showForm();

              const choices = await AdsConsent.getUserChoices();

              console.log(JSON.stringify(choices, null, 2));
            }
          }}
        />

        <Text>
          This test case will not work with the test App ID. You must configure
          your real App ID in app.json and the Consent Form in AdMob/Ad Manager.
          If you are running this test on a device instead of an emulator and if
          you are currently not located in EEA, you have to add your Decive ID
          to the testDeviceIdentifiers of this test case as well.
        </Text>
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

const InterstitialHookComponent = React.forwardRef<View>((_, ref) => {
  const {load, show, error, isLoaded, isClicked, isClosed, isOpened, revenue} =
    useInterstitialAd(TestIds.INTERSTITIAL);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (error !== undefined) {
      console.log(`${Platform.OS} interstitial hook error: ${error.message}`);
    }
  }, [error]);
  useEffect(() => {
    console.log(
      `${Platform.OS} interstitial hook state - loaded/opened/clicked/closed: ${isLoaded}/${isOpened}/${isClicked}/${isClosed}`,
    );
  }, [isLoaded, isOpened, isClicked, isClosed]);

  if (revenue) {
    console.log('Revenue', revenue);
  }

  return (
    <View style={styles.testSpacing} ref={ref}>
      <Text>Loaded? {isLoaded ? 'true' : 'false'}</Text>
      <Text>Error? {error ? error.message : 'false'}</Text>
      <Button
        title="Show Interstitial"
        disabled={!isLoaded}
        onPress={() => {
          show();
        }}
      />
    </View>
  );
});

class InterstitialHookTest implements Test {
  getPath(): string {
    return 'InterstitialHook';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return <InterstitialHookComponent ref={onMount} />;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

const RewardedHookComponent = React.forwardRef<View>((_, ref) => {
  const {
    load,
    show,
    isLoaded,
    error,
    reward,
    isEarnedReward,
    isOpened,
    isClosed,
    isClicked,
  } = useRewardedAd(TestIds.REWARDED);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (error !== undefined) {
      console.log(`${Platform.OS} rewarded hook error: ${error.message}`);
    }
  }, [error]);
  useEffect(() => {
    if (reward !== undefined) {
      console.log(
        `${Platform.OS} rewarded hook reward: ${JSON.stringify(reward)}`,
      );
    }
  }, [reward]);
  useEffect(() => {
    console.log(
      `${Platform.OS} rewarded hook state - loaded/earned/opened/clicked/closed: ${isLoaded}/${isEarnedReward}/${isOpened}/${isClicked}/${isClosed}`,
    );
  }, [isLoaded, isEarnedReward, isOpened, isClicked, isClosed]);

  return (
    <View style={styles.testSpacing} ref={ref}>
      <Text>Loaded? {isLoaded ? 'true' : 'false'}</Text>
      <Text>Error? {error ? error.message : 'false'}</Text>
      <Button
        title="Show Rewarded"
        disabled={!isLoaded}
        onPress={() => {
          show();
        }}
      />
    </View>
  );
});

class RewardedHookTest implements Test {
  getPath(): string {
    return 'RewardedHook';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return <RewardedHookComponent ref={onMount} />;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

const RewardedInterstitialHookComponent = React.forwardRef<View>((_, ref) => {
  const {
    load,
    show,
    isLoaded,
    error,
    reward,
    isEarnedReward,
    isOpened,
    isClosed,
    isClicked,
  } = useRewardedInterstitialAd(TestIds.REWARDED_INTERSTITIAL);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (error !== undefined) {
      console.log(
        `${Platform.OS} rewarded interstitial hook error: ${error.message}`,
      );
    }
  }, [error]);
  useEffect(() => {
    if (reward !== undefined) {
      console.log(
        `${Platform.OS} rewarded interstitial hook reward: ${JSON.stringify(
          reward,
        )}`,
      );
    }
  }, [reward]);
  useEffect(() => {
    console.log(
      `${Platform.OS} rewarded interstitial hook state - loaded/earned/opened/clicked/closed: ${isLoaded}/${isEarnedReward}/${isOpened}/${isClicked}/${isClosed}`,
    );
  }, [isLoaded, isEarnedReward, isOpened, isClicked, isClosed]);

  return (
    <View style={styles.testSpacing} ref={ref}>
      <Text>Loaded? {isLoaded ? 'true' : 'false'}</Text>
      <Text>Error? {error ? error.message : 'false'}</Text>
      <Button
        title="Show Rewarded Interstitial"
        disabled={!isLoaded}
        onPress={() => {
          show();
        }}
      />
    </View>
  );
});

class RewardedInterstitialHookTest implements Test {
  getPath(): string {
    return 'RewardedInterstitialHook';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return <RewardedInterstitialHookComponent ref={onMount} />;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

const AppOpenHookComponent = React.forwardRef<View>((_, ref) => {
  const {load, show, error, isLoaded, isClicked, isClosed, isOpened} =
    useAppOpenAd(TestIds.APP_OPEN);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (error !== undefined) {
      console.log(`${Platform.OS} app open hook error: ${error.message}`);
    }
  }, [error]);
  useEffect(() => {
    console.log(
      `${Platform.OS} app open hook state - loaded/opened/clicked/closed: ${isLoaded}/${isOpened}/${isClicked}/${isClosed}`,
    );
  }, [isLoaded, isOpened, isClicked, isClosed]);

  return (
    <View style={styles.testSpacing} ref={ref}>
      <Text>Loaded? {isLoaded ? 'true' : 'false'}</Text>
      <Text>Error? {error ? error.message : 'false'}</Text>
      <Button
        title="Show App Open"
        disabled={!isLoaded}
        onPress={() => {
          show();
        }}
      />
    </View>
  );
});
class AppOpenHookTest implements Test {
  getPath(): string {
    return 'AppOpenHook';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return <AppOpenHookComponent ref={onMount} />;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

class AdInspectorTest implements Test {
  getPath(): string {
    return 'AdInspectorTest';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Show Ad Inspector"
          onPress={() => {
            MobileAds().openAdInspector();
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

const GAMBannerComponent = React.forwardRef<
  View,
  {
    unitId: string;
    sizes: GAMBannerAdSize[];
  }
>(({unitId, sizes}, ref) => {
  const bannerRef = useRef<GAMBannerAd>(null);
  const recordManualImpression = () => {
    bannerRef.current?.recordManualImpression();
  };
  return (
    <View ref={ref}>
      {/* To test FLUID size ad, use `TestIds.GAM_NATIVE` */}
      <GAMBannerAd
        ref={bannerRef}
        unitId={unitId}
        sizes={sizes}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        manualImpressionsEnabled={true}
        onAdFailedToLoad={(error: Error) => {
          console.log(`${Platform.OS} GAM banner error: ${error.message}`);
        }}
      />
      <Button title="recordManualImpression" onPress={recordManualImpression} />
    </View>
  );
});
class GAMBannerTest implements Test {
  constructor(
    private readonly props: {
      unitId: string;
      sizes: GAMBannerAdSize[];
    },
  ) {}

  getPath(): string {
    return (
      'GAMBanner ' +
      this.props.sizes
        .map(size =>
          size
            .split('_')
            .map(
              (s: string) =>
                s.toLowerCase().charAt(0).toUpperCase() +
                s.toLowerCase().slice(1),
            )
            .join(''),
        )
        .join('_')
    );
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return <GAMBannerComponent ref={onMount} {...this.props} />;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

const gamInterstitial = GAMInterstitialAd.createForAdRequest(
  TestIds.GAM_INTERSTITIAL,
  {
    // requestNonPersonalizedAdsOnly: true,
    // keywords: ['fashion', 'clothing'],
  },
);

class GAMInterstitialTest implements Test {
  adListener: () => void;
  adLoaded = false;

  constructor() {
    // Current no way in jet-next to re-render on async completion or to delay render? But still can log it
    this.adListener = gamInterstitial.addAdEventsListener(({type, payload}) => {
      console.log(`${Platform.OS} GAM interstitial ad event: ${type}`);
      if (type === AdEventType.ERROR) {
        console.log(
          `${Platform.OS} GAM interstitial error: ${
            (payload as Error).message
          }`,
        );
      }
      if (type === AdEventType.LOADED) {
        this.adLoaded = true;
      }
      if (type === GAMAdEventType.APP_EVENT) {
        console.log(
          `${Platform.OS} GAM interstitial app event: ${JSON.stringify(
            payload,
          )}`,
        );
      }
    });
  }

  getPath(): string {
    return 'GAMInterstitial';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Load GAM Interstitial"
          onPress={() => {
            try {
              gamInterstitial.load();
            } catch (e) {
              console.log(`${Platform.OS} GAM Interstitial load error: ${e}`);
            }
          }}
        />
        <Text>Loaded? {this.adLoaded ? 'true' : 'false'}</Text>
        <Button
          title="Show GAM Interstitial"
          onPress={() => {
            gamInterstitial.show();
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
      this.adListener();
    }
  }
}

class DebugMenuTest implements Test {
  constructor() {
    // Android requires SDK initialization before opening the Debug Menu
    Platform.OS === 'android' && MobileAds().initialize().then(res => console.log("initialize", res)).catch(console.error);
  }

  getPath(): string {
    return 'DebugMenuTest';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): React.ReactNode {
    return (
      <View style={styles.testSpacing} ref={onMount}>
        <Button
          title="Show Ad Debug Menu"
          onPress={() => {
            MobileAds().openDebugMenu(TestIds.BANNER);
          }}
        />
      </View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    try {
      // You can do anything here, it will execute on-device + in-app. Results are aggregated + visible in-app.
    } catch (error) {
      results.errors.push('Received unexpected error...');
    } finally {
      complete(results);
    }
  }
}

// All tests must be registered - a future feature will allow auto-bundling of tests via configured path or regex
Object.keys(BannerAdSize).forEach(bannerAdSize => {
  TestRegistry.registerTest(new BannerTest(bannerAdSize));
});
TestRegistry.registerTest(new CollapsibleBannerTest());
TestRegistry.registerTest(new AppOpenTest());
TestRegistry.registerTest(new InterstitialTest());
TestRegistry.registerTest(new RewardedTest());
TestRegistry.registerTest(new RewardedInterstitialTest());
TestRegistry.registerTest(new AdConsentTest());
TestRegistry.registerTest(new InterstitialHookTest());
TestRegistry.registerTest(new RewardedHookTest());
TestRegistry.registerTest(new AppOpenHookTest());
TestRegistry.registerTest(new RewardedInterstitialHookTest());
TestRegistry.registerTest(new AdInspectorTest());
TestRegistry.registerTest(
  new GAMBannerTest({
    unitId: TestIds.GAM_BANNER,
    sizes: [BannerAdSize.ADAPTIVE_BANNER],
  }),
);
TestRegistry.registerTest(
  new GAMBannerTest({
    unitId: TestIds.GAM_NATIVE,
    sizes: [GAMBannerAdSize.FLUID],
  }),
);
TestRegistry.registerTest(new GAMInterstitialTest());
TestRegistry.registerTest(new DebugMenuTest());

const App = () => {
  useEffect(() => {
    const init = async () => {
      const trackingStatus = await requestTrackingPermission();
      if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        // enable tracking features
      }
      MobileAds()
        .initialize()
        .then(res => console.log('initialize Ads', res))
        .catch(console.error);
    };
    init();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: 'pink'}}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{width: "80%"}}>
          <TestRunner /> 
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  testSpacing: {
    margin: 10,
    padding: 10,
  },
});

export default App;
