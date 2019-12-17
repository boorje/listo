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

// styles
import * as colors from '../styles/colors';

const {height, width} = Dimensions.get('window');
const {Value} = Animated;
const animationDuration = 150;

export default function LoadingScreen(props) {
  const [pageActive, setPage] = useState(0);
  const images = [
    require('../assets/groceries2.jpg'),
    require('../assets/groceries2.jpg'),
    require('../assets/groceries2.jpg'),
  ];
  const imageInfo = [];
  const [pages] = useState([
    new Value(0),
    new Value(width),
    new Value(width * 2),
  ]);

  function dots() {
    return (
      <View style={styles.dotView}>
        <View
          style={[
            styles.dot,
            {backgroundColor: pageActive === 0 ? colors.primaryColor : 'gray'},
          ]}
        />
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
      </View>
    );
  }

  const _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {},
    onPanResponderMove: (evt, gestureState) => {
      // TODO: Should not swipe towards ends
      Animated.event([
        null,
        {
          dx: pages[pageActive],
          dy: null,
        },
      ])(evt, gestureState);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < 0 && pageActive < pages.length - 1) {
        swipeLeft();
      } else if (pageActive > 0 && gestureState.dx > 0) {
        swipeRight();
      }
    },
  });

  function swipeLeft() {
    Animated.timing(pages[pageActive], {
      toValue: -width,
      duration: animationDuration,
    }).start();
    Animated.timing(pages[pageActive + 1], {
      toValue: 0,
      delay: animationDuration / 1.5,
      duration: animationDuration,
    }).start();
    setPage(pageActive + 1);
  }

  function swipeRight() {
    Animated.timing(pages[pageActive], {
      toValue: width,
      duration: animationDuration,
    }).start();
    Animated.timing(pages[pageActive - 1], {
      toValue: 0,
      delay: animationDuration / 1.5,
      duration: animationDuration,
    }).start();
    setPage(pageActive - 1);
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.page, {left: pages[0]}]}
        {..._panResponder.panHandlers}>
        <Image source={images[0]} style={styles.image} resizeMode="contain" />
      </Animated.View>
      <Animated.View
        style={[styles.page, {left: pages[1]}]}
        {..._panResponder.panHandlers}>
        <Image source={images[1]} style={styles.image} resizeMode="contain" />
      </Animated.View>
      <Animated.View
        style={[styles.page, {left: pages[2]}]}
        {..._panResponder.panHandlers}>
        <Image source={images[2]} style={styles.image} resizeMode="contain" />
      </Animated.View>

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
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
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
