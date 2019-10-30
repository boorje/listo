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
import PropTypes from 'prop-types';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('window');
const {Value} = Animated;

class Swipeout extends React.Component {
  constructor(props) {
    super(props);

    this.xWidth = new Value(this.state.viewWidth);
    this.xWidth2 = new Value(0);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {
        this.setState({swipeActive: true});
        if (gestureState.dx < 0) {
          this.xWidth.setValue(
            this.getRatio(gestureState.dx) * this.state.viewWidth,
          );
          this.xWidth2.setValue(
            (1 - this.getRatio(gestureState.dx)) * this.state.viewWidth,
          );
          this.setState({trashActive: false});
        }
        if (Math.abs(gestureState.dx) >= this.state.viewWidth / 3) {
          this.setState({trashActive: true});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.parallel([
          Animated.timing(this.xWidth, {
            toValue: this.state.viewWidth,
            duration: 500,
          }),
          Animated.timing(this.xWidth2, {
            toValue: 0,
            duration: 500,
          }),
        ]).start();
      },
    });
  }
  state = {
    trashActive: false,
    viewWidth: 0,
    viewHeight: 100,
    swipeActive: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.viewWidth !== state.viewWidth &&
      props.viewHeight !== state.viewHeight
    ) {
      return {viewWidth: props.viewWidth, viewHeight: props.viewHeight};
    }
  }
  getRatio = dx => {
    return 1 - Math.abs(dx / this.state.viewWidth);
  };

  render() {
    const {trashActive} = this.state;

    return (
      <View style={[styles.container, {height: this.state.viewHeight}]}>
        <Animated.View
          style={[
            {
              width: this.state.swipeActive
                ? this.xWidth
                : this.state.viewWidth,
              height: this.state.viewHeight,
              backgroundColor: 'green',
            },
          ]}
          {...this._panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
        <Animated.View
          style={[
            styles.deleteView,
            {
              width: this.xWidth2,
              height: this.state.viewHeight,
              backgroundColor: trashActive ? 'red' : 'gray',
            },
          ]}>
          <IoniconsIcon
            style={styles.iconStyle}
            size={40}
            color={'white'}
            name={'ios-trash'}
          />
        </Animated.View>
      </View>
    );
  }
}

export default Swipeout;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Swipeout.propTypes = {
  viewWidth: PropTypes.object.isRequired,
};
