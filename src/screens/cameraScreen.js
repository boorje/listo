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

const exImageH =
  'https://images.unsplash.com/photo-1539108842340-ae72fbf39857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80';
const exImageW =
  'https://images.unsplash.com/photo-1512397739299-fe5a4327d192?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';

const {Value, ValueXY} = Animated;
const handleSize = 20;

function CameraScreen(props) {
  // STATES
  const [cameraActive, setCamera] = useState(false); //! Set to true
  const [capture, setCapture] = useState(props.imageUri || exImageH);
  const [cropped, setCropped] = useState(false);

  // STATES - DIMENSIONS
  const width = Dimensions.get('window').width;
  const [initialWidth] = useState(width * 0.9);
  const [imageSize, setImageSize] = useState({});
  const [initialHeight, setInitialHeight] = useState(initialWidth);

  // ANIMATED VALUES - USED FOR CROP VIEW
  const [cropWidthLeft, setCropWidthLeft] = useState(new Value(0));
  const [cropHeightLeft, setCropHeightLeft] = useState(
    new Value(initialHeight),
  );
  const [cropWidthRight, setCropWidthRight] = useState(new Value(0));
  const [cropHeightTop, setCropHeightTop] = useState(new Value(0));
  const [cropHeightBottom, setCropHeightBottom] = useState(new Value(0));

  //HANDLE POSITIONS
  const [topLeftPos] = useState(
    new ValueXY({x: -handleSize / 2, y: -handleSize / 2}),
  );
  const [topRightPos] = useState(
    new ValueXY({
      x: initialWidth - handleSize / 2,
      y: -handleSize / 2,
    }),
  );
  const [bottomLeftPos, setBottomLeftPos] = useState(
    new ValueXY({
      x: -handleSize / 2,
      y: initialHeight - handleSize / 2,
    }),
  );
  const [bottomRightPos, setBottomRightPos] = useState(
    new ValueXY({
      x: initialWidth - handleSize / 2,
      y: initialHeight - handleSize / 2,
    }),
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
    setInitialHeight(initialWidth / (imageSize.w / imageSize.h));
  }, [imageSize.w, imageSize.h, initialWidth]);

  useEffect(() => {
    setBottomLeftPos(
      new ValueXY({
        x: -handleSize / 2,
        y: initialWidth / (imageSize.w / imageSize.h) - handleSize / 2,
      }),
    );
  }, [imageSize.w, imageSize.h, initialWidth]);

  useEffect(() => {
    setBottomRightPos(
      new ValueXY({
        x: initialWidth - handleSize / 2,
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
    cropWidthLeft.setValue(0);
    cropWidthRight.setValue(0);
    cropHeightTop.setValue(0);
    cropHeightBottom.setValue(0);
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

    cropWidthLeft.setOffset(cropWidthLeft._value);
    cropWidthLeft.setValue(0);
    cropWidthRight.setOffset(cropWidthRight._value);
    cropWidthRight.setValue(0);
    cropHeightTop.setOffset(cropHeightTop._value);
    cropHeightTop.setValue(0);
    cropHeightBottom.setOffset(cropHeightBottom._value);
    cropHeightBottom.setValue(0);
  }

  function flattenOffsets() {
    topLeftPos.flattenOffset();
    topRightPos.flattenOffset();
    bottomLeftPos.flattenOffset();
    bottomRightPos.flattenOffset();
    cropWidthLeft.flattenOffset();
    cropWidthRight.flattenOffset();
    cropHeightTop.flattenOffset();
    cropHeightBottom.flattenOffset();
  }

  const _panResponderTopLeft = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, {dx: topLeftPos.x, dy: topLeftPos.y}])(
        evt,
        gestureState,
      );
      Animated.event([null, {dx: cropWidthLeft, dy: cropHeightTop}])(
        evt,
        gestureState,
      );

      if (Math.abs(gestureState.dx) > 0) {
        Animated.event([null, {dx: bottomLeftPos.x, dy: 0}])(evt, gestureState);
      }
      if (Math.abs(gestureState.dy) > 0) {
        Animated.event([null, {dx: 0, dy: topRightPos.y}])(evt, gestureState);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
    },
  });

  const _panResponderTopRight = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, {dx: topRightPos.x, dy: topRightPos.y}])(
        evt,
        gestureState,
      );
      Animated.event([null, {dx: 0, dy: cropHeightTop}])(evt, gestureState);
      if (Math.abs(gestureState.dx) > 0) {
        Animated.event([null, {dx: bottomRightPos.x, dy: 0}])(
          evt,
          gestureState,
        );
      }
      if (Math.abs(gestureState.dy) > 0) {
        Animated.event([null, {dx: 0, dy: topLeftPos.y}])(evt, gestureState);
      }
    },

    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
    },
  });

  const _panResponderBottomLeft = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, {dx: bottomLeftPos.x, dy: bottomLeftPos.y}])(
        evt,
        gestureState,
      );
      Animated.event([null, {dx: cropWidthLeft, dy: 0}])(evt, gestureState);
      cropHeightBottom.setValue(Math.abs(gestureState.dy));
      if (Math.abs(gestureState.dx) > 0) {
        Animated.event([null, {dx: topLeftPos.x, dy: 0}])(evt, gestureState);
      }
      if (Math.abs(gestureState.dy) > 0) {
        Animated.event([null, {dx: 0, dy: bottomRightPos.y}])(
          evt,
          gestureState,
        );
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
    },
  });

  const _panResponderBottomRight = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, {dx: bottomRightPos.x, dy: bottomRightPos.y}])(
        evt,
        gestureState,
      );

      if (Math.abs(gestureState.dx) > 0) {
        Animated.event([null, {dx: topRightPos.x, dy: 0}])(evt, gestureState);
      }
      if (Math.abs(gestureState.dy) > 0) {
        Animated.event([null, {dx: 0, dy: bottomLeftPos.y}])(evt, gestureState);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      flattenOffsets();
    },
  });

  function handle(pos) {
    if (pos === 'topLeft' && !cropped) {
      return (
        <Animated.View
          style={[styles.handle, {left: topLeftPos.x, top: topLeftPos.y}]}
          {..._panResponderTopLeft.panHandlers}
        />
      );
    }
    if (pos === 'topRight' && !cropped) {
      return (
        <Animated.View
          style={[styles.handle, {left: topRightPos.x, top: topRightPos.y}]}
          {..._panResponderTopRight.panHandlers}
        />
      );
    }
    if (pos === 'bottomLeft' && !cropped) {
      return (
        <Animated.View
          style={[styles.handle, {left: bottomLeftPos.x, top: bottomLeftPos.y}]}
          {..._panResponderBottomLeft.panHandlers}
        />
      );
    }
    if (pos === 'bottomRight' && !cropped) {
      return (
        <Animated.View
          style={[
            styles.handle,
            {left: bottomRightPos.x, top: bottomRightPos.y},
          ]}
          {..._panResponderBottomRight.panHandlers}
        />
      );
    }
  }

  function blur(pos) {
    if (pos === 'leftBlur') {
      return (
        <Animated.View
          style={[
            styles.blur,
            {
              height: initialHeight,
              width: cropWidthLeft,
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
              width: cropWidthRight,
              left: topRightPos.x._value + 10,
              top: 0,
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
              height: cropHeightTop,
              width: initialWidth,
              left: topLeftPos.x._value + 10,
              top: topLeftPos.y._value + 10,
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
              height: cropHeightBottom,
              width: initialWidth,
              left: bottomLeftPos.x._value + 10,
              top: bottomLeftPos.y._value,
            },
          ]}
        />
      );
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
          width: cropWidthLeft._value * ratioW, //! Change
          height: cropHeight._value * ratioH, //! Change
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
            {!cropped && (
              <Image
                style={{
                  width: initialWidth,
                  height: initialHeight,
                }}
                source={{uri: capture}}
                resizeMode="contain"
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
              onPress={() => cropImage()}>
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
                  onPress={() => {}}
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
    backgroundColor: 'black',
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
    backgroundColor: 'white',
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
