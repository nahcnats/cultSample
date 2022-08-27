import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';

import AuthScreen, { authScreenOptions } from '../screens/AuthScreen';
import HomeScreen, { homeScreenOptions } from '../screens/HomeScreen';
import SeedScreen, { seedScreenOptions } from '../screens/SeedScreen';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

const defaultNavOptions = {
    headerStyle: {
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
        borderBottomWidth: 0, // just in case
        backgroundColor: Colors.primary,
    },
    headerTitleStyle: {
        fontFamily: 'poppins-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'poppins',
    },
    headerTintColor: 'white',
}

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='AuthScreen'
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='AuthScreen'
                component={AuthScreen}
                options={authScreenOptions}
            />
        </Stack.Navigator>
    );
}

const AuthenticateNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='HomeScreen'
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={homeScreenOptions}
            />
            <Stack.Screen
                name='SeedScreen'
                component={SeedScreen}
                options={seedScreenOptions}
            />
        </Stack.Navigator>
    );
}

function AppNavigation() {
    const isAuth = useSelector(state => !!state.auth.token);
    const dispatch = useDispatch();

    useEffect(() => {
        tryLogin();

        return () => {
            // unmount
        }
    }, [tryLogin]);

    const tryLogin = useCallback(async() => { 
        const userData = await AsyncStorage.getItem('userData');

        if (!userData) {
            return;
        }

        const transformedData = JSON.parse(userData);
        const { token, userId, expiryDate } = transformedData;
        const expirationDate = new Date(expiryDate);

        if (expirationDate <= new Date() || !token || !userId) {
            dispatch(authActions.logout());
        }

        const expirationTime = expirationDate.getTime() - new Date().getTime();
        dispatch(authActions.authenticate(userId, token, expirationTime));
    }, [isAuth]);

    return (
        <NavigationContainer>
            {isAuth ? <AuthenticateNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

export default AppNavigation;