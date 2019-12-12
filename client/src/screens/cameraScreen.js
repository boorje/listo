import React from 'react';
import {StyleSheet, TouchableHighlight, View, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ExitButton from '../components/exitButton';
import textStyles from '../styles/textStyles';

export default function CameraScreen(props) {
  async function takePhoto() {
    const cameraOptions = {base64: true};
    try {
      if (!this.camera) {
        throw 'Could not take a photo. Please try again';
      }
      const response = await this.camera.takePictureAsync(cameraOptions);
      props.navigation.navigate('ImageCropper', {uri: response.uri});
    } catch (error) {
      throw 'Could not take a photo. Please try again';
    }
  }

  return (
    <View style={styles.container}>
      <ExitButton exit={() => props.navigation.pop(1)} color={'white'} />
      <View style={styles.camera}>
        <RNCamera
          style={styles.camera}
          ref={ref => {
            this.camera = ref;
          }}
          captureAudio={false}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.text}>
          <Text
            onPress={() => props.navigation.goBack()}
            style={[textStyles.default, {color: 'white'}]}>
            Back
          </Text>
        </View>
        <TouchableHighlight onPress={() => takePhoto()} style={styles.circle}>
          <View style={styles.button} />
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%', height: '100%'},
  camera: {flex: 5},
  footer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: '8%',
    alignItems: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    height: 65,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 50,
  },
  button: {width: 55, height: 55, backgroundColor: 'white', borderRadius: 50},
  text: {
    position: 'absolute',
    left: '10%',
    top: '50%',
  },
});
