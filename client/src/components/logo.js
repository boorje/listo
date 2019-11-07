import React from 'react';
import {StyleSheet, Image, View, Dimensions, Animated} from 'react-native';
const {height, width} = Dimensions.get('window');

const Logo = props => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    top: height * 0.2,
    position: 'absolute',
  },
  logo: {width: width / 4, height: width / 4},
});
