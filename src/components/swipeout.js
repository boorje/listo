/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Modal,
  PanResponder,
  View,
  Text,
  Dimensions,
  Animated,
} from 'react-native';

const {height, width} = Dimensions.get('window');
const {Value, ValueXY} = Animated;

class Swipeout extends React.Component {
  constructor(props) {
    super(props);
    this.scaleX = new Value(1);
    this.pan = new ValueXY({x: 1, y: 1});

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.scaleX.setOffset(this.scaleX);
      },
      onPanResponderMove: (evt, gestureState) => {
        this.scaleX.setValue(this.getRatio(gestureState.dx));
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.scaleX.flattenOffset();
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
    });
  }

  getRatio = dx => {
    return 1 - Math.abs(dx / width);
  };

  render() {
    const viewStyle = {transform: [{scaleX: this.scaleX}]};

    return (
      <View
        style={{
          width: width,
          position: 'absolute',
          backgroundColor: 'red',
          height: 100,
          top: height / 2,
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <Animated.View
          style={[viewStyle, {width: width, backgroundColor: 'green'}]}
          {...this._panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}

export default Swipeout;

const styles = StyleSheet.create({});
