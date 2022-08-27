import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { configureStore } from '@reduxjs/toolkit';
// import { configureStore, combineReducers, applyMiddleware } from 'redux';
// import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AppNavigation from './navigation';

// import reducers
import authReducer from './store/reducers/auth';
import Colors from './constants/Colors';

let customFonts = {
    'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf')
}

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
});

export default function App() {
    const [fontsLoaded] = useFonts(customFonts);

    useEffect(() => {
        async function prepare() {
            // Keep the splash screen visible while we fetch resources
            await SplashScreen.preventAutoHideAsync();    
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Provider store={store}>
                <StatusBar style="light" backgroundColor={Colors.primary} />
                <AppNavigation />
            </Provider>
        </View>
    );
}
