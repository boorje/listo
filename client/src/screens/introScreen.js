import React, {useState, useEffect} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Image,
  PanResponder,
  Text,
  Dimensions,
} from 'react-native';
// components
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
// styles
import * as colors from '../styles/colors';

const {height, width} = Dimensions.get('window');

export default function LoadingScreen(props) {
  const [pageActive, setPage] = useState(1);
  const test = new Animated.Value(1);

  function dots() {
    return (
      <View style={styles.dotView}>
        <View
          style={[
            styles.dot,
            {backgroundColor: pageActive === 1 ? colors.primaryColor : 'gray'},
          ]}
        />
        <View
          style={[
            styles.dot,
            {backgroundColor: pageActive === 2 ? colors.primaryColor : 'gray'},
          ]}
        />
        <View
          style={[
            styles.dot,
            {backgroundColor: pageActive === 3 ? colors.primaryColor : 'gray'},
          ]}
        />
      </View>
    );
  }

  const _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {},
    onPanResponderMove: (evt, gestureState) => {},
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        setPage(pageActive + 1);
      } else if (pageActive > 1 && gestureState.dx > 0) {
        setPage(pageActive - 1);
      }
      console.log(pageActive);
      Animated.timing(test, {
        toValue: 0.5,
        duration: 1000,
      }).start();
    },
  });

  function page(x) {
    let image = '../assets/groceries.jpeg';
    switch (pageActive) {
      case 1:
        image = '../assets/groceries.jpeg';
    }
    return (
      <Animated.View
        style={[styles.page, {opacity: test}]}
        {..._panResponder.panHandlers}>
        <Image
          source={require('../assets/groceries.jpeg')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      {page(pageActive)}
      {dots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    position: 'absolute',
    width: width,
    height: '70%',

    justifyContent: 'center',
    backgroundColor: 'blue',
    flexDirection: 'row',
  },
  image: {flex: 1, width: '70%', height: undefined, backgroundColor: 'green'},
  text: {flex: 1},
  dotView: {
    position: 'absolute',
    bottom: '8%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});
