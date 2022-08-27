import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';

const CustomButton = (props) => {
    return (
        <TouchableOpacity {...props} style={styles.button}>
            <Text style={styles.title}>{ props.title }</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.accent,
        color: 'white',
        margin: 12,
        padding: 12,
        borderRadius: 5
    },
    title: {
        color: 'black'
    }
});

export default CustomButton;