import React, {useState, useEffect} from 'react';
import {
  PanResponder,
  StyleSheet,
  Dimensions,
  View,
  Image,
  LayoutAnimation,
  Animated,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageEditor from '@react-native-community/image-editor';
import animations from '../styles/animations';
import ExitButton from '../components/exitButton';
import PropTypes from 'prop-types';
import * as colors from '../styles/colors';

const {Value, ValueXY} = Animated;
const handleSize = 30;

function ImageCropper(props) {
  // STATES

  const [capture, setCapture] = useState(props.navigation.getParam('uri', {}));
  const [cropped, setCropped] = useState(false);
  const [cropActive, setCropActive] = useState(false);

  // STATES - DIMENSIONS
  const {height, width} = Dimensions.get('window');
  const maxImageW = width * 0.8;
  const maxImageH = height * 0.6;

  const [initialWidth, setInitialWidth] = useState(maxImageW);
  const [imageSize, setImageSize] = useState({});
  const [initialHeight, setInitialHeight] = useState(maxImageH);

  // ANIMATED VALUES - USED FOR CROP VIEW
  const [cropWidth] = useState(new Value(0));
  const [cropHeight] = useState(new Value(0));

  //HANDLE POSITIONS
  const [topLeftPos, setTopLeftPos] = useState(new ValueXY({x: 0, y: 0}));
  const [topRightPos, setTopRightPos] = useState(new ValueXY({x: 0, y: 0}));
  const [bottomLeftPos, setBottomLeftPos] = useState(new ValueXY({x: 0, y: 0}));
  const [bottomRightPos, setBottomRightPos] = useState(
    new ValueXY({x: 0, y: 0}),
  );

  // USE EFFECTS
  useEffect(() => {
    setCapture(props.navigation.getParam('uri', {}));
  }, [props.navigation]);

  useEffect(() => {
    Image.getSize(
      capture,
      (w, h) => {
        setImageSize({w, h});
      },
      err => console.log(err),
    );
  }, [capture]);

  useEffect(() => {
    setInitialHeight(initialWidth / (imageSize.w / imageSize.h));
    if (imageSize.h > imageSize.w) {
      const newWidth = (imageSize.w * maxImageH) / imageSize.h;
      if (newWidth >= width * 0.9 && newWidth <= width)
        setInitialWidth(newWidth * 0.9);
      else setInitialWidth(newWidth);
    }

    setTopLeftPos(new ValueXY({x: 0, y: 0}));
    setTopRightPos(
      new ValueXY({
        x: initialWidth - handleSize,
        y: 0,
      }),
    );
    setBottomRightPos(
      new ValueXY({
        x: initialWidth - handleSize,
        y: initialWidth / (imageSize.w / imageSize.h) - handleSize,
      }),
    );
    setBottomLeftPos(
      new ValueXY({
        x: 0,
        y: initialWidth / (imageSize.w / imageSize.h) - handleSize,
      }),
    );
  }, [initialWidth, imageSize.w, imageSize.h, initialHeight, maxImageH]);

  function resetImageAndPositions() {
    setCropActive(false);
    setCapture(props.navigation.getParam('uri', {}));
    cropHeight.setValue(initialHeight);
    cropWidth.setValue(initialWidth);
    topLeftPos.setValue({x: 0, y: 0});
    topRightPos.setValue({
      x: initialWidth - handleSize,
      y: 0,
    });
    bottomLeftPos.setValue({
      x: 0,
      y: initialHeight - handleSize,
    });

    bottomRightPos.setValue({
      x: initialWidth - handleSize,
      y: initialHeight - handleSize,
    });
  }

  function toggleOffsets() {
    topLeftPos.setOffset({
      x: topLeftPos.x._value,
      y: topLeftPos.y._value,
    });
    topLeftPos.setValue({x: 0, y: 0});

    topRightPos.setOffset({
      x: topRightPos.x._value,
      y: topRightPos.y._value,
    });
    topRightPos.setValue({x: 0, y: 0});

    bottomLeftPos.setOffset({
      x: bottomLeftPos.x._value,
      y: bottomLeftPos.y._value,
    });
    bottomLeftPos.setValue({x: 0, y: 0});

    bottomRightPos.setOffset({
      x: bottomRightPos.x._value,
      y: bottomRightPos.y._value,
    });
    bottomRightPos.setValue({x: 0, y: 0});
  }

  function flattenOffsets() {
    topLeftPos.flattenOffset();
    topRightPos.flattenOffset();
    bottomLeftPos.flattenOffset();
    bottomRightPos.flattenOffset();
  }

  const _panResponderTopLeft = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      setCropActive(true);
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      topLeftPos.setValue({x: gestureState.dx, y: gestureState.dy});
      bottomLeftPos.setValue({x: gestureState.dx, y: 0});
      topRightPos.setValue({x: 0, y: gestureState.dy});
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      if (topLeftPos.x._value < -10) {
        topLeftPos.setValue({x: -10, y: topLeftPos.y._value});
        bottomLeftPos.setValue({x: -10, y: bottomLeftPos.y._value});
      } else if (
        topLeftPos.x._value > topRightPos.x._value ||
        topLeftPos.x._value >= initialWidth
      ) {
        Animated.parallel([
          Animated.timing(topLeftPos.x, {
            toValue: topRightPos.x._value - 60,
            duration: 300,
          }),
          Animated.timing(bottomLeftPos.x, {
            toValue: topRightPos.x._value - 60,
            duration: 300,
          }),
        ]).start();
      }
      if (topLeftPos.y._value < -10) {
        topLeftPos.setValue({x: topLeftPos.x._value, y: -10});
        topRightPos.setValue({x: topRightPos.x._value, y: -10});
      } else if (
        topLeftPos.y._value > bottomLeftPos.y._value ||
        topLeftPos.y._value >= initialHeight
      ) {
        Animated.parallel([
          Animated.timing(topLeftPos.y, {
            toValue: bottomLeftPos.y._value - 60,
            duration: 300,
          }),
          Animated.timing(topRightPos.y, {
            toValue: bottomLeftPos.y._value - 60,
            duration: 300,
          }),
        ]).start();
      }
    },
  });

  const _panResponderTopRight = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      setCropActive(true);
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      topRightPos.setValue({x: gestureState.dx, y: gestureState.dy});
      topLeftPos.setValue({x: 0, y: gestureState.dy});
      bottomRightPos.setValue({x: gestureState.dx, y: 0});
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      if (topRightPos.x._value > initialWidth - handleSize) {
        topRightPos.setValue({
          x: initialWidth - handleSize,
          y: topRightPos.y._value,
        });
        bottomRightPos.setValue({
          x: initialWidth - handleSize,
          y: bottomLeftPos.y._value,
        });
      } else if (
        topRightPos.x._value < topLeftPos.x._value ||
        topRightPos.x._value <= 0
      ) {
        Animated.parallel([
          Animated.timing(topRightPos.x, {
            toValue: topLeftPos.x._value + 60,
            duration: 300,
          }),
          Animated.timing(bottomRightPos.x, {
            toValue: topLeftPos.x._value + 60,
            duration: 300,
          }),
        ]).start();
      }

      if (topRightPos.y._value < -10) {
        topRightPos.setValue({x: topRightPos.x._value, y: -10});
        topLeftPos.setValue({x: topLeftPos.x._value, y: -10});
      } else if (
        topRightPos.y._value > bottomRightPos.y._value ||
        topRightPos.y._value >= initialHeight
      ) {
        Animated.parallel([
          Animated.timing(topRightPos.y, {
            toValue: bottomRightPos.y._value - 60,
            duration: 300,
          }),
          Animated.timing(topLeftPos.y, {
            toValue: bottomRightPos.y._value - 60,
            duration: 300,
          }),
        ]).start();
      }
    },
  });

  const _panResponderBottomLeft = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      setCropActive(true);
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      bottomLeftPos.setValue({x: gestureState.dx, y: gestureState.dy});
      topLeftPos.setValue({x: gestureState.dx, y: 0});
      bottomRightPos.setValue({x: 0, y: gestureState.dy});
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      if (bottomLeftPos.x._value < -10) {
        bottomLeftPos.setValue({
          x: -10,
          y: bottomLeftPos.y._value,
        });
        topLeftPos.setValue({
          x: -10,
          y: topLeftPos.y._value,
        });
      } else if (
        bottomLeftPos.x._value > bottomRightPos.x._value ||
        bottomLeftPos.x._value >= initialWidth
      ) {
        Animated.parallel([
          Animated.timing(bottomLeftPos.x, {
            toValue: bottomRightPos.x._value - 60,
            duration: 300,
          }),
          Animated.timing(topLeftPos.x, {
            toValue: bottomRightPos.x._value - 60,
            duration: 300,
          }),
        ]).start();
      }

      if (bottomLeftPos.y._value > initialHeight - handleSize) {
        bottomLeftPos.setValue({
          x: bottomLeftPos.x._value,
          y: initialHeight - handleSize,
        });
        bottomRightPos.setValue({
          x: bottomRightPos.x._value,
          y: initialHeight - handleSize,
        });
      } else if (
        bottomLeftPos.y._value < topLeftPos.y._value ||
        bottomLeftPos.y._value <= 0
      ) {
        Animated.parallel([
          Animated.timing(bottomLeftPos.y, {
            toValue: topLeftPos.y._value + 60,
            duration: 300,
          }),
          Animated.timing(bottomRightPos.y, {
            toValue: topLeftPos.y._value + 60,
            duration: 300,
          }),
        ]).start();
      }
    },
  });

  const _panResponderBottomRight = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      setCropActive(true);
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      bottomRightPos.setValue({x: gestureState.dx, y: gestureState.dy});
      topRightPos.setValue({x: gestureState.dx, y: 0});
      bottomLeftPos.setValue({x: 0, y: gestureState.dy});
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      if (bottomRightPos.x._value > initialWidth - handleSize) {
        bottomRightPos.setValue({
          x: initialWidth - handleSize,
          y: bottomRightPos.y._value,
        });
        topRightPos.setValue({
          x: initialWidth - handleSize,
          y: topRightPos.y._value,
        });
      } else if (
        bottomRightPos.x._value < bottomLeftPos.x._value ||
        bottomRightPos.x._value <= 0
      ) {
        Animated.parallel([
          Animated.timing(bottomRightPos.x, {
            toValue: bottomLeftPos.x._value + 60,
            duration: 300,
          }),
          Animated.timing(topRightPos.x, {
            toValue: bottomLeftPos.x._value + 60,
            duration: 300,
          }),
        ]).start();
      }

      if (bottomRightPos.y._value > initialHeight - handleSize) {
        bottomRightPos.setValue({
          x: bottomRightPos.x._value,
          y: initialHeight - handleSize,
        });
        bottomLeftPos.setValue({
          x: bottomLeftPos.x._value,
          y: initialHeight - handleSize,
        });
      } else if (
        bottomRightPos.y._value < topRightPos.y._value ||
        bottomRightPos.y._value <= 0
      ) {
        Animated.parallel([
          Animated.timing(bottomRightPos.y, {
            toValue: topRightPos.y._value + 60,
            duration: 300,
          }),
          Animated.timing(bottomLeftPos.y, {
            toValue: topRightPos.y._value + 60,
            duration: 300,
          }),
        ]).start();
      }
    },
  });

  function handle(pos) {
    const boundLeftX = topLeftPos.x.interpolate({
      inputRange: [0, initialWidth],
      outputRange: [0, initialWidth],
      extrapolate: 'clamp',
    });

    const boundRightX = topRightPos.x.interpolate({
      inputRange: [-handleSize, initialWidth - handleSize],
      outputRange: [-handleSize, initialWidth - handleSize],
      extrapolate: 'clamp',
    });
    const boundTopY = topLeftPos.y.interpolate({
      inputRange: [0, initialHeight],
      outputRange: [0, initialHeight],
      extrapolate: 'clamp',
    });
    const boundBottomY = bottomLeftPos.y.interpolate({
      inputRange: [-handleSize, initialHeight - handleSize],
      outputRange: [-handleSize, initialHeight - handleSize],
      extrapolate: 'clamp',
    });
    if (!cropped) {
      if (pos === 'topLeft') {
        return (
          <Animated.View
            style={[
              styles.handle,
              {
                borderTopWidth: 3,
                borderLeftWidth: 3,
                transform: [{translateX: boundLeftX}, {translateY: boundTopY}],
              },
            ]}
            {..._panResponderTopLeft.panHandlers}
          />
        );
      }
      if (pos === 'topRight') {
        return (
          <Animated.View
            style={[
              styles.handle,
              {
                borderTopWidth: 3,
                borderRightWidth: 3,
                transform: [{translateX: boundRightX}, {translateY: boundTopY}],
              },
            ]}
            {..._panResponderTopRight.panHandlers}
          />
        );
      }
      if (pos === 'bottomLeft') {
        return (
          <Animated.View
            style={[
              styles.handle,
              {
                borderBottomWidth: 3,
                borderLeftWidth: 3,
                transform: [
                  {translateX: boundLeftX},
                  {translateY: boundBottomY},
                ],
              },
            ]}
            {..._panResponderBottomLeft.panHandlers}
          />
        );
      }
      if (pos === 'bottomRight') {
        return (
          <Animated.View
            style={[
              styles.handle,
              {
                borderBottomWidth: 3,
                borderRightWidth: 3,
                transform: [
                  {translateX: boundRightX},
                  {translateY: boundBottomY},
                ],
              },
            ]}
            {..._panResponderBottomRight.panHandlers}
          />
        );
      }
    }
  }

  function blur(pos) {
    const topLeftBlurWidth = topRightPos.x.interpolate({
      inputRange: [0, initialWidth],
      outputRange: [handleSize, initialWidth + handleSize],
      extrapolate: 'clamp',
    });
    const topLeftBlurHeight = topLeftPos.y.interpolate({
      inputRange: [0, initialHeight],
      outputRange: [0, initialHeight],
      extrapolate: 'clamp',
    });
    const topRightBlurWidth = topRightPos.x.interpolate({
      inputRange: [-handleSize, initialWidth - handleSize],
      outputRange: [initialWidth, 0],
      extrapolate: 'clamp',
    });
    const topRightBlurHeight = bottomRightPos.y.interpolate({
      inputRange: [-handleSize, initialHeight - handleSize],
      outputRange: [0, initialHeight],
      extrapolate: 'clamp',
    });
    const bottomLeftBlurWidth = bottomLeftPos.x.interpolate({
      inputRange: [0, initialWidth],
      outputRange: [0, initialWidth],
      extrapolate: 'clamp',
    });
    const bottomLeftBlurHeight = topLeftPos.y.interpolate({
      inputRange: [0, initialHeight],
      outputRange: [initialHeight, 0],
      extrapolate: 'clamp',
    });
    const bottomRightBlurWidth = bottomLeftPos.x.interpolate({
      inputRange: [0, initialWidth],
      outputRange: [initialWidth, 0],
      extrapolate: 'clamp',
    });
    const bottomRightBlurHeight = bottomRightPos.y.interpolate({
      inputRange: [-handleSize, initialHeight - handleSize],
      outputRange: [initialHeight, 0],
      extrapolate: 'clamp',
    });

    if (!cropped) {
      if (pos === 'topLeftBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: topLeftBlurHeight,
                width: topLeftBlurWidth,
                left: 0,
              },
            ]}
          />
        );
      }

      if (pos === 'topRightBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: topRightBlurHeight,
                width: topRightBlurWidth,
                right: 0,
                top: 0,
              },
            ]}
          />
        );
      }

      if (pos === 'bottomLeftBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: bottomLeftBlurHeight,
                width: bottomLeftBlurWidth,
                left: 0,
                bottom: 0,
              },
            ]}
          />
        );
      }

      if (pos === 'bottomRightBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: bottomRightBlurHeight,
                width: bottomRightBlurWidth,
                right: 0,
                bottom: 0,
              },
            ]}
          />
        );
      }
    }
  }

  function getSize() {
    return new Promise((resolve, reject) => {
      Image.getSize(
        capture,
        (w, h) => resolve({w, h}),
        () => reject('No width and height found.'),
      );
    });
  }

  async function cropImage() {
    try {
      cropHeight.setValue(
        Math.abs(topLeftPos.y._value - bottomLeftPos.y._value),
      );
      cropWidth.setValue(Math.abs(topLeftPos.x._value - topRightPos.x._value));
      const {w, h} = await getSize();
      const ratioImage = w / h;
      const ratioW = w / initialWidth;
      const ratioH = h / (initialWidth / ratioImage);
      const cropData = {
        offset: {
          x: topLeftPos.x._value * ratioW,
          y: topLeftPos.y._value * ratioH,
        },
        size: {
          width: (cropWidth._value + handleSize) * ratioW,
          height: (cropHeight._value + handleSize) * ratioH,
        },
        resizeMode: 'contain',
      };
      const croppedImageURI = await ImageEditor.cropImage(capture, cropData);
      if (croppedImageURI) {
        LayoutAnimation.configureNext(animations.default);
        setCapture(croppedImageURI);
        setCropped(true);
      }
    } catch (cropError) {
      console.log('cropError: ' + cropError);
    }
  }

  function icon(name) {
    return (
      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          name === 'crop'
            ? cropActive
              ? cropImage()
              : props.navigation.navigate('DetectText', {image: capture})
            : null;
          if (name === 'arrow-forward')
            props.navigation.navigate('DetectText', {image: capture});
          if (name === 'refresh') {
            LayoutAnimation.configureNext(animations.default);
            setCropped(false);
            resetImageAndPositions();
          }
          if (name === 'camera-alt') props.navigation.goBack();
        }}>
        <Icon size={30} color={'white'} name={name} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ExitButton exit={() => props.navigation.pop(2)} color={'white'} />
      {initialHeight ? (
        <View>
          <View>
            <Animated.Image
              style={{
                width: !cropped ? initialWidth : width * 0.8,
                height: !cropped ? initialHeight : height * 0.6,
              }}
              source={{uri: capture}}
              resizeMode="contain"
            />

            {blur('topLeftBlur')}
            {blur('topRightBlur')}
            {blur('bottomLeftBlur')}
            {blur('bottomRightBlur')}

            {handle('topLeft')}
            {handle('topRight')}
            {handle('bottomLeft')}
            {handle('bottomRight')}
          </View>

          <View style={styles.iconView}>
            {!cropped && icon('camera-alt')}
            {!cropped
              ? !cropActive
                ? icon('arrow-forward')
                : icon('crop')
              : null}
            {cropped && icon('refresh')}
            {cropped && icon('arrow-forward')}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default ImageCropper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  handle: {
    position: 'absolute',
    width: handleSize,
    height: handleSize,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  blur: {
    backgroundColor: 'black',
    opacity: 0.6,
    position: 'absolute',
  },
  icon: {
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: colors.primaryColor,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
