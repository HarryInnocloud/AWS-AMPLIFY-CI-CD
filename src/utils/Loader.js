import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from './../constants/colors.json'

const Loader = () => (
    <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={Colors.AccentColor} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
});

export default Loader;