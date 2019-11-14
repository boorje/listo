import React, {PureComponent, useState} from 'react';
import {
  PanResponder,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  View,
  Image,
  Animated,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ImageCropper from 'react-native-advance-image-cropper';

const exImage =
  'https://images.unsplash.com/photo-1520440229-6469a149ac59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80';
const {height, width} = Dimensions.get('window');
const initialHeight = height * 0.8;
const initialWidth = width * 0.8;
const screenRatio = width / height;
const {Value, ValueXY} = Animated;

function CameraScreen(props) {
  const [cameraActive, setCamera] = useState(false); //! Set to true
  const [capture, setCapture] = useState('');
  const [cropWidth, setCropWidth] = useState(initialWidth);
  const [cropHeight, setCropHeight] = useState(initialHeight);
  const [cropLeft, setCropLeft] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);

  //HANDLE POSITIONS
  const topLeftPos = new ValueXY({x: -15, y: -15});
  const topRightPos = new ValueXY({x: initialWidth - 15, y: -15});
  const bottomLeftPos = new ValueXY({x: -15, y: initialHeight - 15});
  const bottomRightPos = new ValueXY({
    x: initialWidth - 15,
    y: initialHeight - 15,
  });

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
      setCropHeight(Math.abs(topLeftPos.y._value - bottomLeftPos.y._value));
      setCropWidth(Math.abs(topLeftPos.x._value - topRightPos.x._value));
      setCropLeft(topLeftPos.x._value + 15);
      setCropTop(topLeftPos.y._value + 15);
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
      setCropHeight(Math.abs(bottomRightPos.y._value - topRightPos.y._value));
      setCropWidth(Math.abs(bottomRightPos.x._value - bottomLeftPos.x._value));
      setCropRight(bottomRightPos.x._value + 15);
      setCropBottom(bottomRightPos.y._value + 15);
    },
  });
  function handle(pos) {
    if (pos === 'topLeft') {
      return (
        <Animated.View
          style={[styles.handle, {left: topLeftPos.x, top: topLeftPos.y}]}
          {..._panResponderTopLeft.panHandlers}
        />
      );
    }
    if (pos === 'topRight') {
      return (
        <Animated.View
          style={[styles.handle, {left: topRightPos.x, top: topRightPos.y}]}
          {..._panResponderTopRight.panHandlers}
        />
      );
    }
    if (pos === 'bottomLeft') {
      return (
        <Animated.View
          style={[styles.handle, {left: bottomLeftPos.x, top: bottomLeftPos.y}]}
          {..._panResponderBottomLeft.panHandlers}
        />
      );
    }
    if (pos === 'bottomRight') {
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
        <Animated.View style={styles.imageView}>
          <Image
            style={{
              aspectRatio: screenRatio,
            }}
            source={{uri: exImage}}
          />
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
          {handle('topLeft')}
          {handle('topRight')}
          {handle('bottomLeft')}
          {handle('bottomRight')}
        </Animated.View>
      )}
    </View>
  );
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
  imageView: {
    width: initialWidth,
    height: initialHeight,
  },
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
