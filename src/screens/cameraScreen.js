import React, {PureComponent, useState} from 'react';
import {
  PanResponder,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('window');

function CameraScreen(props) {
  const [cameraActive, setCamera] = useState(true);
  const [capture, setCapture] = useState([]);

  async function takePhoto() {
    const cameraOptions = {base64: true};
    try {
      if (!this.camera) {
        throw 'Could not take a photo. Please try again';
      }
      const response = await this.camera.takePictureAsync(cameraOptions);
      setCapture(response);
      setCamera(false);
    } catch (error) {
      throw 'Could not take a photo. Please try again';
    }
  }

  const _panResponderLeft = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      console.log('Left grant');
    },
    onPanResponderMove: (evt, gestureState) => {},

    onPanResponderRelease: (evt, gestureState) => {},
  });
  const _panResponderRight = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      console.log(' right grant');
    },
    onPanResponderMove: (evt, gestureState) => {},

    onPanResponderRelease: (evt, gestureState) => {},
  });
  const _panResponderTop = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      console.log(' top grant');
    },
    onPanResponderMove: (evt, gestureState) => {},

    onPanResponderRelease: (evt, gestureState) => {},
  });
  const _panResponderBottom = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      console.log(' bottom grant');
    },
    onPanResponderMove: (evt, gestureState) => {},

    onPanResponderRelease: (evt, gestureState) => {},
  });

  function handle(pos) {
    if (pos === 'left') {
      return (
        <View
          style={[styles.handle, {left: -15, top: '50%'}]}
          {..._panResponderLeft.panHandlers}
        />
      );
    }
    if (pos === 'right') {
      return (
        <View
          style={[styles.handle, {right: -15, top: '50%'}]}
          {..._panResponderRight.panHandlers}
        />
      );
    }
    if (pos === 'top') {
      return (
        <View
          style={[styles.handle, {top: -15, left: (width * 0.8) / 2 - 15}]}
          {..._panResponderTop.panHandlers}
        />
      );
    }
    if (pos === 'bottom') {
      return (
        <View
          style={[styles.handle, {bottom: -15, left: (width * 0.8) / 2 - 15}]}
          {..._panResponderBottom.panHandlers}
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
        <View style={{flex: 1}}>
          <View style={styles.image}>
            <Image
              style={{flex: 1}}
              source={{
                uri: capture.uri,
              }}
            />
            {handle('left')}
            {handle('right')}
            {handle('top')}
            {handle('bottom')}
          </View>
          <View style={styles.icon}>
            <IoniconsIcon
              size={80}
              color={'black'}
              name={'ios-camera'}
              onPress={() => setCamera(true)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    marginTop: 100,
    width: width * 0.8,
    height: height * 0.6,
  },
  icon: {
    flex: 1,
    bottom: 100,
    position: 'absolute',
    alignSelf: 'center',
  },
  handle: {
    flex: 1,
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: 'green',
    position: 'absolute',
  },
});
