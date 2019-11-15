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
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ImageEditor from '@react-native-community/image-editor';
import animations from '../styles/animations';

const exImageH =
  'https://images.unsplash.com/photo-1539108842340-ae72fbf39857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80';
const exImageW =
  'https://images.unsplash.com/photo-1512397739299-fe5a4327d192?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';

const {Value, ValueXY} = Animated;

function CameraScreen(props) {
  const [cameraActive, setCamera] = useState(false); //! Set to true
  const [capture, setCapture] = useState(exImageW);
  const [imageSize, setImageSize] = useState({});
  const [cropped, setCropped] = useState(false);

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

  const {height, width} = Dimensions.get('window');
  const initialWidth = width * 0.9;
  const initialHeight = initialWidth / (imageSize.w / imageSize.h);

  const cropWidth = new Value(initialWidth);
  const cropHeight = new Value(initialHeight);
  const cropLeft = new Value(0);
  const cropRight = new Value(0);
  const cropTop = new Value(0);
  const cropBottom = new Value(0);

  //HANDLE POSITIONS
  const topLeftPos = new ValueXY({x: -15, y: -15});
  const topRightPos = new ValueXY({x: initialWidth - 15, y: -15});
  const bottomLeftPos = new ValueXY({x: -15, y: initialHeight - 15});
  const bottomRightPos = new ValueXY({
    x: initialWidth - 15,
    y: initialHeight - 15,
  });

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
      cropLeft.setValue(topLeftPos.x._value + 15);
      cropTop.setValue(topLeftPos.y._value + 15);
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
      cropRight.setValue(topRightPos.x._value + 15);
      cropTop.setValue(topRightPos.y._value + 15);
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
      cropBottom.setValue(bottomLeftPos.y._value + 15);
      cropLeft.setValue(bottomLeftPos.x._value + 15);
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
      cropRight.setValue(bottomRightPos.x._value + 15);
      cropBottom.setValue(bottomRightPos.y._value + 15);
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
    return new Promise((resolve, reject) =>
      Image.getSize(
        capture,
        (w, h) => resolve({w, h}),
        () => reject('No width and height found.'),
      ),
    );
  }

  async function cropImage() {
    try {
      const {w, h} = await getSize();
      const ratioImage = w / h;
      const ratioW = w / initialWidth;
      const ratioH = h / (initialWidth / ratioImage);
      const cropData = {
        offset: {
          x: (topLeftPos.x._value + 15) * ratioW,
          y: (topLeftPos.y._value + 15) * ratioH,
        },
        size: {
          width: cropWidth._value * ratioW,
          height: cropHeight._value * ratioH,
        },
        displaySize: {width: cropWidth._value, height: cropHeight._value},
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

  if (initialHeight) {
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
        ) : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{
                width: initialWidth,
                height: initialHeight,
              }}
              source={{uri: capture}}
              resizeMode="contain"
            />
            {!cropped && (
              <Animated.View
                style={[
                  styles.cropView,
                  {
                    width: cropWidth,
                    height: cropHeight,
                    left: cropLeft,
                    right: cropRight,
                    top: cropTop,
                    bottom: cropBottom,
                  },
                ]}
              />
            )}
            {handle('topLeft')}
            {handle('topRight')}
            {handle('bottomLeft')}
            {handle('bottomRight')}

            <IoniconsIcon
              style={{marginTop: 20}}
              size={50}
              color={'black'}
              name={'ios-crop'}
              onPress={() => cropImage()}
            />
          </View>
        )}
      </View>
    );
  } else return null;
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageView: {backgroundColor: 'blue'},
  cropView: {
    backgroundColor: 'black',
    position: 'absolute',
    opacity: 0.5,
  },
  handle: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'green',
  },
});
