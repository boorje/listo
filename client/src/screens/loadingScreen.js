import React, {useState, useEffect} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import * as colors from '../styles/colors';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import LoadingComponent from '../components/loadingComponent';

export default function LoadingScreen(props) {
  return (
    <LinearGradient colors={colors.testShade} style={styles.container}>
      <LoadingComponent color={'white'} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  icons: {},
});
