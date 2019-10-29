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
  TouchableOpacity,
} from 'react-native';

const {height, width} = Dimensions.get('window');
const {Value, ValueXY} = Animated;

class Swipeout extends React.Component {
  constructor(props) {
    super(props);

    this.xWidth = new Value(width);
    this.xWidth2 = new Value(0);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {
        this.xWidth.setValue(this.getRatio(gestureState.dx) * width);
        this.xWidth2.setValue((1 - this.getRatio(gestureState.dx)) * width);
      },
      onPanResponderRelease: (evt, gestureState) => {},
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
          height: 100,
          top: height / 2,
          flexDirection: 'row',
        }}>
        <Animated.View
          style={[{width: this.xWidth, backgroundColor: 'green'}]}
          {...this._panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
        <Animated.View style={[{width: this.xWidth2, backgroundColor: 'red'}]}>
          <TouchableOpacity style={{flex: 1}}>
            <Text style={{color: 'white'}}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

export default Swipeout;

const styles = StyleSheet.create({});
