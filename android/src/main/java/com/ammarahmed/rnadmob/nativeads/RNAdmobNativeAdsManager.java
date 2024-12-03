package com.ammarahmed.rnadmob.nativeads;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.AdInspectorError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.OnAdInspectorClosedListener;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.initialization.AdapterStatus;
import com.google.android.gms.ads.initialization.InitializationStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


import com.google.android.gms.ads.identifier.AdvertisingIdClient;

public class RNAdmobNativeAdsManager extends ReactContextBaseJavaModule {
    public ReactApplicationContext mContext;
    public RNAdmobNativeAdsManager(ReactApplicationContext context) {
        super(context);
        mContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "RNAdmobNativeAdsManager";
    }

    @ReactMethod
    public void getDeviceId(Promise promise) {
        try {
                AdvertisingIdClient.Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(mContext);
                String deviceId = adInfo.getId();
                Log.d("AdMobDeviceId", "Your DeviceId: " + deviceId);
                promise.resolve(deviceId);
            } catch (Exception e) {
                Log.e("AdMobDeviceId", "Failed to fetch DeviceId", e);
            }
    }

    @ReactMethod
    public void startInspector(Promise promise) {
        if (getReactApplicationContext().getCurrentActivity() == null) {
        Utils.rejectPromiseWithCodeAndMessage(
            promise,
            "null-activity",
            "Ad Inspector attempted to open but the current Activity was null.");
        return;
        }
        getReactApplicationContext().getCurrentActivity()
            .runOnUiThread(
                () -> {
                MobileAds.openAdInspector(
                    mContext,
                    new OnAdInspectorClosedListener() {
                        @Override
                        public void onAdInspectorClosed(@Nullable AdInspectorError adInspectorError) {
                        if (adInspectorError != null) {
                            String code = "";
                            switch (adInspectorError.getCode()) {
                            case AdInspectorError.ERROR_CODE_INTERNAL_ERROR:
                                code = "INTERNAL_ERROR";
                                break;
                            case AdInspectorError.ERROR_CODE_FAILED_TO_LOAD:
                                code = "FAILED_TO_LOAD";
                                break;
                            case AdInspectorError.ERROR_CODE_NOT_IN_TEST_MODE:
                                code = "NOT_IN_TEST_MODE";
                                break;
                            case AdInspectorError.ERROR_CODE_ALREADY_OPEN:
                                code = "ALREADY_OPEN";
                                break;
                            }
                            Utils.rejectPromiseWithCodeAndMessage(
                                promise, code, adInspectorError.getMessage());
                        } else {
                            promise.resolve(null);
                        }
                        }
                    });
                });
    }

    // @ReactMethod
    // public void openDebugMenu(String adUnitId) {
    //     MobileAds.openDebugMenu(mContext, adUnitId);
    // }

    @ReactMethod
    public void openDebugMenu(final String adUnit) {
        if (getCurrentActivity() != null) {
        getCurrentActivity()
            .runOnUiThread(() -> MobileAds.openDebugMenu(getReactApplicationContext().getCurrentActivity(), adUnit));
        }
    }

    @ReactMethod
    public void setRequestConfiguration(ReadableMap config, Promise promise) {
        Context context = getReactApplicationContext().getCurrentActivity();
        if (context == null) {
            Log.e("AdmobNativeAds", "setRequestConfiguration() is called outside MainActivity");
            context = getReactApplicationContext();
        }
        RequestConfiguration.Builder configuration = new RequestConfiguration.Builder();

        if (config.hasKey("maxAdContentRating")) {
            if (config.getString("maxAdContentRating") != null) {
                String maxAdContentRating = config.getString("maxAdContentRating");
                if (maxAdContentRating != null) {
                    if (maxAdContentRating.equals("UNSPECIFIED"))
                        maxAdContentRating = "";
                    configuration.setMaxAdContentRating(maxAdContentRating);
                }
            }
        }

        if (config.hasKey("tagForChildDirectedTreatment")) {
            boolean tagForChildDirectedTreatment = config.getBoolean("tagForChildDirectedTreatment");
            configuration.setTagForChildDirectedTreatment(tagForChildDirectedTreatment ? 1 : 0);
        }
        if (config.hasKey("tagForUnderAgeOfConsent")) {
            boolean tagForUnderAgeOfConsent = config.getBoolean("tagForUnderAgeOfConsent");
            configuration.setTagForUnderAgeOfConsent(tagForUnderAgeOfConsent ? 1 : 0);
        }

        if (config.hasKey("testDeviceIds")) {
            configuration.setTestDeviceIds(Arguments.toList(config.getArray("testDeviceIds")));
        }

        MobileAds.setRequestConfiguration(configuration.build());
        MobileAds.initialize(context, (InitializationStatus status) -> {
            WritableArray array = Arguments.createArray();
            for (Map.Entry<String, AdapterStatus> entry: status.getAdapterStatusMap().entrySet()) {
                WritableMap info = Arguments.createMap();
                info.putString("name", entry.getKey());
                info.putInt("state", entry.getValue().getInitializationState().ordinal());
                info.putString("description", entry.getValue().getDescription());
                array.pushMap(info);
            }
            promise.resolve(array);
        });
    }

    @ReactMethod
    public void isTestDevice(Promise promise) {
        AdRequest builder = new AdRequest.Builder().build();
        promise.resolve(builder.isTestDevice(getReactApplicationContext()));
    }

    @ReactMethod
    public void registerRepository(ReadableMap config, Promise promise){
        CacheManager.instance.registerRepository(mContext, config, promise);
    }

    @ReactMethod
    public void unRegisterRepository(String id){
        CacheManager.instance.unRegisterRepository(id);
    }

    @ReactMethod
    public void resetCache(){
        CacheManager.instance.resetCache();
    }

    @ReactMethod
    public void hasAd(String repository, Promise promise) {
        promise.resolve(CacheManager.instance.hasAd(repository));
    }

}
