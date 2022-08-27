import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { LogBox } from 'react-native';

import API from '../../constants/API';

let timer;
LogBox.ignoreLogs([
    "Setting a timer for a long period of time",
    // name of the error/warning here, or a regex here
]);

function clearLogoutTimer() {
    if (timer) {
        clearTimeout(timer);
    }
}

export function logout() {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: 'LOGOUT' };
}

function setLogoutTimer(expirationTime) {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout())
        }, expirationTime);
    }
}

function saveDataToStorage(token, userId, expirationDate) {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString(),
    }));
}

function getExpiryDate(expiresIn) {
    return new Date(
        new Date().getTime() + Number(expiresIn) * 1000
    );
}

export function authenticate(userId, token, expiryTime) {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: 'AUTHENTICATE', userId: userId, token: token });
    }
}

export function register(email, password) {
    return async dispatch => {
        try {
            const response = await axios.post(`${API.authSignUpUrl}`, {
                email: email,
                password: password,
                returnSecureToken: true
            }, API.options);

            const resData = await response.data;

            const expirationDate = getExpiryDate(resData.expiresIn);

            dispatch(authenticate(
                resData.localId,
                resData.idToken,
                Number(resData.expiresIn) * 1000
            ));

            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
        } catch (e) {
            const errorId = e.response.data.error.message;
            
            let message = 'Something went wrong!';

            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exist already';
            }

            throw new Error(message);
        }
    }
}

export function login(email, password) {
    return async dispatch => {
        try {
            const response = await axios.post(`${API.authSignInUrl}`, {
                email: email,
                password: password,
                returnSecureToken: true,
            }, API.options);

            const resData = await response.data;

            const expirationDate = getExpiryDate(resData.expiresIn);

            dispatch(authenticate(
                resData.localId,
                resData.idToken,
                Number(resData.expiresIn) * 1000
            ));

            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
        } catch (e) {
            const errorId = e.response.data.error.message;
            let message = 'Something went wrong!';

            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!'
            }

            throw new Error(message);
        }
    }
}