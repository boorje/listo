import React, {PureComponent, useState, useEffect} from 'react';
import {
  PanResponder,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  View,
  Image,
  LayoutAnimation,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageEditor from '@react-native-community/image-editor';
import animations from '../styles/animations';
import PrimaryButton from '../components/buttons/primaryButton';
import * as colors from '../styles/colors';
import textStyles from '../styles/textStyles';
import {a} from '@aws-amplify/ui';
import {validateYupSchema} from 'formik';

const exImageH =
  'https://images.unsplash.com/photo-1539108842340-ae72fbf39857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80';
const exImageW =
  'https://images.unsplash.com/photo-1512397739299-fe5a4327d192?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';

const {Value, ValueXY} = Animated;
const handleSize = 20;

function CameraScreen(props) {
  // STATES
  const [cameraActive, setCamera] = useState(props.cameraActive || false);
  const [capture, setCapture] = useState(props.imageUri || exImageH);
  const [cropped, setCropped] = useState(false);

  // STATES - DIMENSIONS
  const {height, width} = Dimensions.get('window');
  const [initialWidth] = useState(width * 0.8); //! Why is it not working with e.g. 0.7?
  const [imageSize, setImageSize] = useState({});
  const [initialHeight, setInitialHeight] = useState(initialWidth);

  // ANIMATED VALUES - USED FOR CROP VIEW
  const [cropWidth] = useState(new Value(initialWidth));
  const [cropHeight, setCropHeight] = useState(new Value(0));
  const [blurLeft, setBlurLeft] = useState(new Value(0));
  const [blurRight, setBlurRight] = useState(new Value(0));
  const [blurWidth, setBlurWidth] = useState(new Value(0));
  const [blurWidthLeft] = useState(new Value(0));
  const [blurWidthRight] = useState(new Value(0));
  const [blurHeightTop] = useState(new Value(0));
  const [blurHeightBottom] = useState(new Value(0));

  //HANDLE POSITIONS
  const [topLeftPos, setTopLeftPos] = useState(new ValueXY({x: 0, y: 0}));
  const [topRightPos, setTopRightPos] = useState(new ValueXY({x: 0, y: 0}));
  const [bottomLeftPos, setBottomLeftPos] = useState(new ValueXY({x: 0, y: 0}));
  const [bottomRightPos, setBottomRightPos] = useState(
    new ValueXY({x: 0, y: 0}),
  );

  // USE EFFECTS
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
    setBlurWidth(cropWidth);
  }, [cropWidth]);

  useEffect(() => {
    setInitialHeight(initialWidth / (imageSize.w / imageSize.h));
    setCropHeight(new Value(initialWidth / (imageSize.w / imageSize.h)));
    setTopLeftPos(new ValueXY({x: -handleSize / 2, y: -handleSize / 2}));
    setTopRightPos(
      new ValueXY({
        x: initialWidth - handleSize / 2,
        y: -handleSize / 2,
      }),
    );
    setBottomRightPos(
      new ValueXY({
        x: initialWidth - handleSize / 2,
        y: initialWidth / (imageSize.w / imageSize.h) - handleSize / 2,
      }),
    );
    setBottomLeftPos(
      new ValueXY({
        x: -handleSize / 2,
        y: initialWidth / (imageSize.w / imageSize.h) - handleSize / 2,
      }),
    );
  }, [imageSize.w, imageSize.h, initialWidth]);

  function resetImageAndPositions() {
    setCapture(props.imageUri || exImageH);
    topLeftPos.setValue({x: -handleSize / 2, y: -handleSize / 2});
    topRightPos.setValue({
      x: initialWidth - handleSize / 2,
      y: -handleSize / 2,
    });
    bottomLeftPos.setValue({
      x: -handleSize / 2,
      y: initialHeight - handleSize / 2,
    });
    bottomRightPos.setValue({
      x: initialWidth - handleSize / 2,
      y: initialHeight - handleSize / 2,
    });
    blurWidthLeft.setValue(0);
    blurWidthRight.setValue(0);
    blurHeightTop.setValue(0);
    blurHeightBottom.setValue(0);
    blurLeft.setValue(0);
    blurRight.setValue(0);
    blurWidth.setValue(initialWidth);
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

    blurWidthLeft.setOffset(blurWidthLeft._value);
    blurWidthLeft.setValue(0);
    blurWidthRight.setOffset(blurWidthRight._value);
    blurWidthRight.setValue(0);
    blurHeightTop.setOffset(blurHeightTop._value);
    blurHeightTop.setValue(0);
    blurWidth.setOffset(blurWidth._value);
    blurWidth.setValue(0);
    blurLeft.setOffset(blurLeft._value);
    blurLeft.setValue(0);
    blurRight.setOffset(blurRight._value);
    blurRight.setValue(0);
    blurHeightBottom.setOffset(blurHeightBottom._value);
    blurHeightBottom.setValue(0);
  }

  function flattenOffsets() {
    topLeftPos.flattenOffset();
    topRightPos.flattenOffset();
    bottomLeftPos.flattenOffset();
    bottomRightPos.flattenOffset();
    blurWidthLeft.flattenOffset();
    blurWidthRight.flattenOffset();
    blurHeightTop.flattenOffset();
    blurLeft.flattenOffset();
    blurRight.flattenOffset();
    blurWidth.flattenOffset();
    blurHeightBottom.flattenOffset();
  }

  const _panResponderTopLeft = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      console.log(cropHeight);
      topLeftPos.setValue({x: gestureState.dx, y: gestureState.dy});
      bottomLeftPos.setValue({x: gestureState.dx, y: 0});
      topRightPos.setValue({x: 0, y: gestureState.dy});
      blurWidthLeft.setValue(gestureState.dx);
      blurHeightTop.setValue(gestureState.dy);
      blurLeft.setValue(gestureState.dx);
      blurWidth.setValue(-gestureState.dx);
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      cropHeight.setValue(
        Math.abs(topLeftPos.y._value - bottomLeftPos.y._value),
      );
      cropWidth.setValue(Math.abs(topLeftPos.x._value - topRightPos.x._value));
    },
  });

  const _panResponderTopRight = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      topRightPos.setValue({x: gestureState.dx, y: gestureState.dy});
      topLeftPos.setValue({x: 0, y: gestureState.dy});
      bottomRightPos.setValue({x: gestureState.dx, y: 0});
      blurHeightTop.setValue(gestureState.dy);
      blurWidth.setValue(gestureState.dx);

      if (gestureState.dx < 0) {
        blurWidthRight.setValue(Math.abs(gestureState.dx));
        blurRight.setValue(Math.abs(gestureState.dx));
      } else {
        blurWidthRight.setValue(-gestureState.dx);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      cropHeight.setValue(
        Math.abs(topRightPos.y._value - bottomRightPos.y._value),
      );
      cropWidth.setValue(Math.abs(topRightPos.x._value - topLeftPos.x._value));
    },
  });

  const _panResponderBottomLeft = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      bottomLeftPos.setValue({x: gestureState.dx, y: gestureState.dy});
      topLeftPos.setValue({x: gestureState.dx, y: 0});
      bottomRightPos.setValue({x: 0, y: gestureState.dy});
      blurLeft.setValue(gestureState.dx);
      blurWidthLeft.setValue(gestureState.dx);
      blurWidth.setValue(-gestureState.dx);
      if (gestureState.dy < 0) {
        blurHeightBottom.setValue(Math.abs(gestureState.dy));
      } else {
        blurHeightBottom.setValue(-gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      cropHeight.setValue(
        Math.abs(bottomLeftPos.y._value - topLeftPos.y._value),
      );
      cropWidth.setValue(
        Math.abs(bottomLeftPos.x._value - bottomRightPos.x._value),
      );
    },
  });

  const _panResponderBottomRight = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      bottomRightPos.setValue({x: gestureState.dx, y: gestureState.dy});
      topRightPos.setValue({x: gestureState.dx, y: 0});
      bottomLeftPos.setValue({x: 0, y: gestureState.dy});
      blurWidth.setValue(gestureState.dx);

      if (gestureState.dx < 0) {
        blurWidthRight.setValue(Math.abs(gestureState.dx));
        blurRight.setValue(Math.abs(gestureState.dx));
      } else {
        blurWidthRight.setValue(-gestureState.dx);
      }

      if (gestureState.dy < 0) {
        blurHeightBottom.setValue(Math.abs(gestureState.dy));
      } else {
        blurHeightBottom.setValue(-gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
      cropHeight.setValue(
        Math.abs(bottomRightPos.y._value - topRightPos.y._value),
      );
      cropWidth.setValue(
        Math.abs(bottomRightPos.x._value - bottomLeftPos.x._value),
      );
    },
  });

  function handle(pos) {
    const boundLeftX = topLeftPos.x.interpolate({
      inputRange: [-handleSize / 2, initialWidth],
      outputRange: [-handleSize / 2, initialWidth],
      extrapolate: 'clamp',
    });
    const boundRightX = topRightPos.x.interpolate({
      inputRange: [-handleSize / 2, initialWidth - handleSize / 2],
      outputRange: [-handleSize / 2, initialWidth - handleSize / 2],
      extrapolate: 'clamp',
    });
    const boundTopY = topLeftPos.y.interpolate({
      inputRange: [-handleSize / 2, initialHeight],
      outputRange: [-handleSize / 2, initialHeight],
      extrapolate: 'clamp',
    });
    const boundBottomY = bottomLeftPos.y.interpolate({
      inputRange: [-handleSize / 2, initialHeight - handleSize / 2],
      outputRange: [-handleSize / 2, initialHeight - handleSize / 2],
      extrapolate: 'clamp',
    });
    if (!cropped) {
      if (pos === 'topLeft') {
        return (
          <Animated.View
            style={[
              styles.handle,
              {
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
    const transformWidth = cropWidth.interpolate({
      inputRange: [0, initialWidth],
      outputRange: [0, initialWidth],
      extrapolate: 'clamp',
    });
    const transformHeight = cropHeight.interpolate({
      inputRange: [0, initialHeight],
      outputRange: [0, initialHeight],
      extrapolate: 'clamp',
    });
    const transformLeft = cropWidth.interpolate({
      inputRange: [0, initialWidth],
      outputRange: [initialWidth, 0],
      extrapolate: 'clamp',
    });
    const transformRight = cropWidth.interpolate({
      inputRange: [0, initialWidth],
      outputRange: [initialWidth, 0],
      extrapolate: 'clamp',
    });
    if (!cropped) {
      if (pos === 'leftBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: initialHeight,
                width: blurWidthLeft,
                left: 0,
                bottom: 0,
              },
            ]}
          />
        );
      }

      if (pos === 'rightBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: initialHeight,
                width: blurWidthRight,
                right: 0,
                top: 0,
                marginLeft: blurWidthRight,
              },
            ]}
          />
        );
      }

      if (pos === 'topBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: blurHeightTop,
                width: transformWidth,
                left: blurLeft,
                right: blurRight,
                top: 0,
              },
            ]}
          />
        );
      }

      if (pos === 'bottomBlur') {
        return (
          <Animated.View
            style={[
              styles.blur,
              {
                height: blurHeightBottom,
                width: transformWidth,
                left: blurLeft,
                right: blurRight,
                bottom: 0,
                marginTop: blurHeightBottom,
              },
            ]}
          />
        );
      }
    }
  }

  async function takePhoto() {
    const cameraOptions = {base64: true};

    try {
      if (!this.camera) {
        throw 'Could not take a photo. Please try again';
      }
      const response = await this.camera.takePictureAsync(cameraOptions);
      setCapture(response.uri);
      setCamera(false);
    } catch (error) {
      throw 'Could not take a photo. Please try again';
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
      const {w, h} = await getSize();
      const ratioImage = w / h;
      const ratioW = w / initialWidth;
      const ratioH = h / (initialWidth / ratioImage);
      const cropData = {
        offset: {
          x: (topLeftPos.x._value + handleSize / 2) * ratioW,
          y: (topLeftPos.y._value + handleSize / 2) * ratioH,
        },
        size: {
          width: cropWidth._value * ratioW,
          height: cropHeight._value * ratioH,
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
  // const test = cropHeight.interpolate({
  //   inputRange: [0, initialWidth],
  //   outputRange: [initialWidth, 0],
  //   extrapolate: 'clamp',
  // });

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <TouchableHighlight style={styles.camera} onPress={() => takePhoto()}>
          <RNCamera
            style={styles.camera}
            ref={ref => {
              this.camera = ref;
            }}
            captureAudio={false}
          />
        </TouchableHighlight>
      ) : initialHeight ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Animated.Image
              style={{
                width: initialWidth,
                height: !cropped ? initialHeight : height * 0.6,
              }}
              source={{uri: capture}}
              resizeMode="contain"
            />
            {!cropped && (
              <Animated.View
                style={{
                  position: 'absolute',
                  height: cropHeight,
                  width: cropWidth,
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: 'red',
                }}
              />
            )}

            {blur('leftBlur')}
            {blur('rightBlur')}
            {blur('topBlur')}
            {blur('bottomBlur')}
            {handle('topLeft')}
            {handle('topRight')}
            {handle('bottomLeft')}
            {handle('bottomRight')}
          </View>
          {!cropped ? (
            <TouchableOpacity
              style={styles.cropButton}
              onPress={() => {
                cropImage();
              }}>
              <Icon size={30} color={'white'} name={'crop'} />
              <Text style={[textStyles.button, {fontWeight: '500'}]}>Crop</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                top: 50,
                alignItems: 'center',
              }}>
              <IoniconsIcon
                style={{paddingHorizontal: 50}}
                size={50}
                color={'white'}
                name={'ios-refresh'}
                onPress={() => {
                  LayoutAnimation.configureNext(animations.default);
                  setCropped(false);
                  resetImageAndPositions();
                }}
              />
              <View style={{width: 200, marginTop: 20}}>
                <PrimaryButton
                  disabled={false}
                  title={'Use image'}
                  onPress={() => props.useImage()}
                />
              </View>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cropView: {
    backgroundColor: 'black',
    borderColor: 'white',
  },
  handle: {
    position: 'absolute',
    width: handleSize,
    height: handleSize,
    borderRadius: 50,
    backgroundColor: 'black',
  },
  blur: {
    backgroundColor: 'black',
    opacity: 0.8,
    position: 'absolute',
  },
  cropButton: {
    marginTop: 50,
    borderRadius: 50,
    padding: 10,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
  },
});
