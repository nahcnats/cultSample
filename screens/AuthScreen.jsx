import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, View, StyleSheet, Button, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch()

    const formReducer = (state, action) => {
        if (action.type === FORM_INPUT_UPDATE) {
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            };

            const updateValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid
            };

            let updatedFormIsValid = true;

            for (const key in updateValidities) {
                updatedFormIsValid = updatedFormIsValid && updateValidities[key];
            }

            return {
                formIsValid: updatedFormIsValid,
                inputValues: updatedValues,
                inputValidities: updateValidities,
            }
        };

        return state;
    }

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured!', error, [{ text: 'OK' }]);
        }
    }, [error]);
    

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false,
    });

    const inputChangeHandler = useCallback((inputIndentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIndentifier
        });
    }, [dispatchFormState]);

    async function authHandler() {
        let action;

        if (isSignUp) {
            action = authActions.register(
                formState.inputValues.email,
                formState.inputValues.password,
            );
        } else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password,
            )
        }

        setError(null);
        setIsLoading(true);

        try {
            await dispatch(action);
        } catch (e) {
            setError(e.message);
            setIsLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={styles.screen}>
            <LinearGradient colors={['#FF6347', 'transparent']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id='email'
                            label='E-mail'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize='none'
                            errorText='Please enter a valid email'
                            onInputChange={inputChangeHandler}
                        />
                        <Input
                            id='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={6}
                            autoCapitalize='none'
                            errorText='Please enter a valid password'
                            onInputChange={inputChangeHandler}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`${isSignUp ? 'Register' : 'Login'}`}
                                color={Colors.accent}
                                onPress={authHandler}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            {
                                isLoading
                                    ? <ActivityIndicator size='small' color={Colors.primary} />
                                    : <Button
                                        title={`Switch to ${isSignUp ? 'Login' : 'Register'}`}
                                        color={Colors.accent}
                                        onPress={() => setIsSignUp(prev => !prev)}
                                    />
                            }
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

export const authScreenOptions = {
    headerTitle: 'Login'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        paddingTop: 100,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20,
    },
    buttonContainer: {
        marginTop: 10,
    }
});

export default AuthScreen;