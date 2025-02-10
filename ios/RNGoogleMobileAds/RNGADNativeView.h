#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

@import GoogleMobileAds;
#import "AdListener.h"
@interface RNGADNativeView : GADNativeAdView <AdListener,GADNativeAdLoaderDelegate,
GADNativeAdDelegate>

@property(nonatomic, strong) GADNativeAdView *nativeAdView;
@property(nonatomic, strong) GADAdLoader *adLoader;

@property (nonatomic, copy) NSArray *testDevices;
@property (nonatomic, copy) NSNumber *refreshInterval;
@property (nonatomic, copy) NSString *adUnitID;
@property (nonatomic, copy) NSNumber *delayAdLoad;
@property (nonatomic, copy) NSNumber *headline;
@property (nonatomic, copy) NSNumber *tagline;
@property (nonatomic, copy) NSNumber *advertiser;
@property (nonatomic, copy) NSNumber *store;
@property (nonatomic, copy) NSNumber *price;
@property (nonatomic, copy) NSNumber *image;
@property (nonatomic, copy) NSNumber *icon;
@property (nonatomic, copy) NSNumber *mediaview;
@property (nonatomic, copy) NSNumber *starrating;
@property (nonatomic, copy) NSNumber *callToAction;
@property (nonatomic, copy) NSNumber *adChoicesPlacement;
@property (nonatomic) BOOL *requestNonPersonalizedAdsOnly;


@property (nonatomic, copy) NSNumber *mediaAspectRatio;
@property (nonatomic, copy) NSDictionary *mediationOptions;
@property (nonatomic, copy) NSDictionary *targetingOptions;
@property (nonatomic, copy) NSDictionary *videoOptions;
@property (nonatomic, copy) NSDictionary *enableSwipeGestureOptions;

- (instancetype)initWithBridge:(RCTBridge *)bridge;

- (void)loadAd;

@property (nonatomic, copy) RCTDirectEventBlock onAdLoaded;
@property (nonatomic, copy) RCTDirectEventBlock onAdFailedToLoad;
@property (nonatomic, copy) RCTDirectEventBlock onAdOpened;
@property (nonatomic, copy) RCTDirectEventBlock onAdClosed;
@property (nonatomic, copy) RCTDirectEventBlock onAdLeftApplication;
@property (nonatomic, copy) RCTDirectEventBlock onAdClicked;
@property (nonatomic, copy) RCTDirectEventBlock onAdImpression;
@property (nonatomic, copy) RCTDirectEventBlock onNativeAdLoaded;

@property (nonatomic, assign) BOOL isLoading;

@end
