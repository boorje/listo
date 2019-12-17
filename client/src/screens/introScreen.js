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
const {Value} = Animated;

export default function LoadingScreen(props) {
  const [pageActive, setPage] = useState(0);
  const images = ['../assets/groceries2.jpg', '2'];
  const imageInfo = [];
  const [pages] = useState([
    new Value(0),
    new Value(width),
    new Value(width * 2),
  ]);
  const [page1] = useState(new Value(0));
  const [page2] = useState(new Value(width));
  const [page3] = useState(new Value(width * 2));

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
    onPanResponderGrant: (evt, gestureState) => {
      pages[0].setOffset(pages[0]._value);
      pages[0].setValue(0);
      pages[1].setOffset(pages[1]._value);
      pages[1].setValue(0);
      pages[2].setOffset(pages[2]._value);
      pages[2].setValue(0);
    },
    onPanResponderMove: (evt, gestureState) => {},
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < 0 && pageActive < pages.length - 1) {
        swipeLeft();
      } else if (pageActive > 0 && gestureState.dx > 0) {
        swipeRight();
      }
      pages[0].flattenOffset();
      pages[1].flattenOffset();
      pages[2].flattenOffset();
    },
  });

  function swipeLeft() {
    Animated.stagger(0, [
      Animated.sequence([
        Animated.timing(pages[pageActive], {
          toValue: -width,
          duration: 200,
        }),
        Animated.timing(pages[pageActive + 1], {
          toValue: 0,
          duration: 200,
        }),
      ]),
    ]).start();
    setPage(pageActive + 1);
  }

  function swipeRight() {
    Animated.stagger(50, [
      Animated.sequence([
        Animated.timing(pages[pageActive], {
          toValue: width,
          duration: 200,
        }),
        Animated.timing(pages[pageActive - 1], {
          toValue: 0,
          duration: 200,
        }),
      ]),
    ]).start();
    setPage(pageActive - 1);
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.page, {left: pages[0]}]}
        {..._panResponder.panHandlers}>
        <Image
          source={require('../assets/groceries2.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={[styles.page, {left: pages[1]}]}
        {..._panResponder.panHandlers}>
        <Image
          // source={require('../assets/groceries.jpeg')}
          source={require('../assets/groceries2.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={[styles.page, {left: pages[2]}]}
        {..._panResponder.panHandlers}>
        <Image
          // source={require('../assets/winestand.jpg')}
          source={require('../assets/groceries2.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
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
