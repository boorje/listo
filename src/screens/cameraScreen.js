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
  ImageBackground,
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
  const imageUri = exImageH; //! REMOVE
  const [overlayImage, setOverlayImage] = useState(exImageH); //! SET TO PROP
  const [imageSize, setImageSize] = useState({});
  const [cropped, setCropped] = useState(false);

  // CONSTANTS
  const {height, width} = Dimensions.get('window');
  const initialWidth = width * 0.9;
  const initialHeight = initialWidth / (imageSize.w / imageSize.h);

  // ANIMATED VALUES - USED FOR CROP VIEW
  const cropWidth = new Value(initialWidth);
  const cropHeight = new Value(initialHeight);
  const cropLeft = new Value(0);
  const cropRight = new Value(0);
  const cropTop = new Value(0);
  const cropBottom = new Value(0);

  //HANDLE POSITIONS
  const [topLeftPos, setTopLeftPos] = useState(
    new ValueXY({x: -handleSize / 2, y: -handleSize / 2}),
  );
  const [topRightPos, setTopRightPos] = useState(
    new ValueXY({
      x: initialWidth - handleSize / 2,
      y: -handleSize / 2,
    }),
  );
  const [bottomLeftPos, setBottomLeftPos] = useState(
    new ValueXY({
      x: -handleSize / 2,
      y: height / 2 - handleSize / 2, //! Trouble with initialHeight
    }),
  );
  const [bottomRightPos, setBottomRightPos] = useState(
    new ValueXY({
      x: initialWidth - handleSize / 2,
      y: height / 2 - handleSize / 2,
    }),
  );

  useEffect(() => {
    async function getImageSize() {
      await Image.getSize(
        capture,
        (w, h) => setImageSize({w, h}),
        err => console.log(err),
      );
    }
    getImageSize();
  }, [capture]);

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
      toggleOffsets();
    },
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, {dx: topLeftPos.x, dy: topLeftPos.y}])(
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
      cropHeight.setValue(
        Math.abs(topLeftPos.y._value - bottomLeftPos.y._value),
      );
      cropWidth.setValue(Math.abs(topLeftPos.x._value - topRightPos.x._value));
      cropLeft.setValue(topLeftPos.x._value + handleSize / 2);
      cropTop.setValue(topLeftPos.y._value + handleSize / 2);
      cropOverlayImage();
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
      cropHeight.setValue(
        Math.abs(topRightPos.y._value - bottomRightPos.y._value),
      );
      cropWidth.setValue(Math.abs(topRightPos.x._value - topLeftPos.x._value));
      cropRight.setValue(topRightPos.x._value + handleSize / 2);
      cropTop.setValue(topRightPos.y._value + handleSize / 2);
      cropOverlayImage();
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
      cropHeight.setValue(
        Math.abs(bottomLeftPos.y._value - topLeftPos.y._value),
      );
      cropWidth.setValue(
        Math.abs(bottomLeftPos.x._value - bottomRightPos.x._value),
      );
      cropBottom.setValue(bottomLeftPos.y._value + handleSize / 2);
      cropLeft.setValue(bottomLeftPos.x._value + handleSize / 2);
      cropOverlayImage();
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
      cropHeight.setValue(
        Math.abs(bottomRightPos.y._value - topRightPos.y._value),
      );
      cropWidth.setValue(
        Math.abs(bottomRightPos.x._value - bottomLeftPos.x._value),
      );
      cropRight.setValue(bottomRightPos.x._value + handleSize / 2);
      cropBottom.setValue(bottomRightPos.y._value + handleSize / 2);
      cropOverlayImage();
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

  async function cropOverlayImage() {
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
      const croppedImageURI = await ImageEditor.cropImage(imageUri, cropData);
      if (croppedImageURI) {
        LayoutAnimation.configureNext(animations.default);
        setOverlayImage(croppedImageURI);
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
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View>
            {!cropped && (
              <Image
                style={{
                  opacity: 0.2,
                  width: initialWidth,
                  height: initialHeight,
                }}
                source={{uri: capture}}
                resizeMode="contain"
              />
            )}

            <Animated.Image
              style={[
                styles.cropView,
                {
                  width: cropWidth,
                  height: cropHeight,
                  left: !cropped ? cropLeft : null,
                  right: !cropped ? cropRight : null,
                  top: !cropped ? cropTop : null,
                  bottom: !cropped ? cropBottom : null,
                  position: !cropped ? 'absolute' : 'relative',
                },
              ]}
              source={{uri: overlayImage}}
            />

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
                  setOverlayImage(imageUri);
                  cropHeight.setValue(initialHeight);
                  cropWidth.setValue(initialWidth);
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
  },
  handle: {
    position: 'absolute',
    width: handleSize,
    height: handleSize,
    borderRadius: 50,
    backgroundColor: 'white',
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
