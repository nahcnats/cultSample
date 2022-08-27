import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function Layout({ children }) {
    return (
        <LinearGradient colors={['#FF6347', 'transparent']} style={styles.gradient}>
            { children }
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        // paddingTop: 100,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});

export default Layout;