import React from 'react';
import {
  StyleSheet,
  Modal,
  PanResponder,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Dimensions,
  Animated,
} from 'react-native';
import animations from '../../styles/animations';

const screenHeight = Dimensions.get('window').height;

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
        if (this.state.fullyOpen) {
          this.state.pan.setOffset({
            x: this.state.pan.x._value,
            y: this.state.pan.y._value,
          });
        }
        this.state.pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
      onPanResponderRelease: (evt, gestureState) => {
        // Modal half open
        if (!this.state.fullyOpen) {
          if (this.state.pan.y._value <= -screenHeight / 7) {
            Animated.timing(this.state.pan, {
              toValue: {x: 0, y: (-screenHeight * 0.65) / 2},
              duration: 100,
            }).start();
            this.setState({fullyOpen: true});
          } else if (this.state.pan.y._value >= screenHeight / 7) {
            this.props.closeModal();
          } else {
            Animated.timing(this.state.pan, {
              toValue: {x: 0, y: 0},
              duration: 100,
            }).start();
          }
        }
        //Modal fully open
        else {
          //this.setState({pan: new Animated.ValueXY()});
          if (this.state.pan.y._value >= screenHeight / 3.5) {
            this.props.closeModal();
          } else if (this.state.pan.y._value >= screenHeight / 8) {
            this.state.pan.flattenOffset();
            Animated.timing(this.state.pan, {
              toValue: {x: 0, y: 0},
              duration: 100,
            }).start();
            this.setState({fullyOpen: false});
          } else {
            this.state.pan.flattenOffset();
            Animated.timing(this.state.pan, {
              toValue: {x: 0, y: -(screenHeight * 0.65) / 2},
              duration: 100,
            }).start();
          }
        }
        this.state.pan.flattenOffset();
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,
    });
  }

  state = {
    pan: new Animated.ValueXY(),
    fullyOpen: false,
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
