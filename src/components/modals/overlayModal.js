import React from 'react';
import {
  StyleSheet,
  Modal,
  PanResponder,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';

class OverlayModal extends React.Component {
  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setOffset({
          x: this.state.pan.x._value,
          y: this.state.pan.y._value,
        });
        this.state.pan.setValue({x: 0, y: 0});
        console.log(this.state.pan);
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
      onPanResponderRelease: (evt, gestureState) => {
        this.state.pan.flattenOffset();
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,
    });
  }

  state = {
    pan: new Animated.ValueXY(),
  };

  render() {
    const {pan} = this.state;
    const [translateX, translateY] = [0, pan.y];
    const viewStyle = {transform: [{translateX}, {translateY}]};

    return (
      <Modal animationType="slide" transparent={true} visible={true}>
        <Animated.View style={[viewStyle, styles.container]}>
          <View
            style={styles.handleContainer}
            {...this._panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>
          {this.props.children}
        </Animated.View>
      </Modal>
    );
  }
}

export default OverlayModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: '50%',
    backgroundColor: 'rgba(52, 52, 52, 1)',
  },
  handleContainer: {
    justifyContent: 'center',
    height: '3%',
  },
  dragHandle: {
    height: 4,
    width: '35%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
  },
});
