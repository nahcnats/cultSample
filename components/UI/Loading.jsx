import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Colors from '../../constants/Color';

function Loading() {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Loading;