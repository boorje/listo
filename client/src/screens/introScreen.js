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
import {Easing} from 'react-native';

// styles
import * as colors from '../styles/colors';
import textStyles from '../styles/textStyles';

const {height, width} = Dimensions.get('window');
const {Value} = Animated;
const animationDuration = 150;

export default function LoadingScreen(props) {
  const [pageActive, setPage] = useState(0);
  const images = [
    require('../assets/homeScreen.png'),
    require('../assets/imageCropper.png'),
    require('../assets/itemSelection.png'),
  ];
  const imageTitle = [
    'Sharing is caring ❤️',
    'Scan for ingredients 📸',
    'Select only what you need ✅',
  ];
  const imageText = [
    'Share your lists with family and friends and keep track of what needs to be bought.',
    'By using OCR technolgy the app recognizes grocery items in, let´s say a recipe.',
    'Select the items recognized by the app that you need.',
  ];
  const [pages] = useState([new Value(0), new Value(width), new Value(width)]);

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
      if (
        (gestureState.dx < 0 && pageActive < pages.length - 1) ||
        (pageActive > 0 && gestureState.dx > 0)
      ) {
        pages[pageActive].setValue(gestureState.dx);
      }
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
      easing: Easing.linear,
      duration: animationDuration,
    }).start();
    Animated.timing(pages[pageActive + 1], {
      toValue: 0,
      delay: animationDuration / 1.5,
      easing: Easing.linear,
      duration: animationDuration,
    }).start();
    setPage(pageActive + 1);
  }

  function swipeRight() {
    Animated.timing(pages[pageActive], {
      toValue: width,
      easing: Easing.linear,
      duration: animationDuration,
    }).start();
    Animated.timing(pages[pageActive - 1], {
      toValue: 0,
      delay: animationDuration / 1.5,
      easing: Easing.linear,
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
        <View style={styles.textView}>
          <Text style={[textStyles.default]}>{imageTitle[0]}</Text>
          <Text style={styles.text}>{imageText[0]}</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[styles.page, {left: pages[1]}]}
        {..._panResponder.panHandlers}>
        <Image source={images[1]} style={styles.image} resizeMode="contain" />
        <View style={styles.textView}>
          <Text style={[textStyles.default]}>{imageTitle[1]}</Text>
          <Text style={styles.text}>{imageText[1]}</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[styles.page, {left: pages[2]}]}
        {..._panResponder.panHandlers}>
        <Image source={images[2]} style={styles.image} resizeMode="contain" />
        <View style={styles.textView}>
          <Text style={[textStyles.default]}>{imageTitle[2]}</Text>
          <Text style={styles.text}>{imageText[2]}</Text>
        </View>
      </Animated.View>

      <View style={styles.skipButton}>
        <Text
          onPress={() => props.navigation.navigate('Login')}
          style={{color: colors.primaryColor}}>
          Skip
        </Text>
      </View>
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
    height: '75%',
    justifyContent: 'center',
  },
  image: {
    flex: 5,
    width: undefined,
    height: undefined,
  },
  textView: {
    flex: 1,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  text: {textAlign: 'center', color: 'gray', marginTop: '5%'},
  dotView: {
    position: 'absolute',
    bottom: '8%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  skipButton: {
    position: 'absolute',
    bottom: '8%',
    right: '12%',
  },
});
