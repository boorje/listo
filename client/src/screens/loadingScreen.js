import React from 'react';
import {StyleSheet} from 'react-native';
// components
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import LoadingComponent from '../components/loadingComponent';
// styles
import * as colors from '../styles/colors';

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
});
