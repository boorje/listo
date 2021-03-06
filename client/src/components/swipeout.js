/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  PanResponder,
  View,
  Animated,
  ActionSheetIOS,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import animations from '../styles/animations';

const {Value} = Animated;
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
class Swipeout extends React.Component {
  constructor(props) {
    super(props);
    this.height = this.props.swipeOutHeight;
    this.xWidth = new Value(this.state.viewWidth);
    this.xWidth2 = new Value(0);
    this.iconMargin = Animated.multiply(this.xWidth2, 0.7);
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          this.state.swipeoutEnabled &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },

      onPanResponderMove: (evt, gestureState) => {
        this.props.disableScroll();
        this.setState({swipeActive: true});
        if (
          gestureState.dx < 0 &&
          Math.abs(gestureState.dx) < this.state.initialWidth / 2
        ) {
          this.xWidth.setValue(
            this.getRatio(gestureState.dx) * this.state.viewWidth,
          );
          this.xWidth2.setValue(
            (1 - this.getRatio(gestureState.dx)) * this.state.viewWidth,
          );
          this.setState({trashActive: false});
          if (Math.abs(gestureState.dx) >= this.state.viewWidth / 3) {
            if (!this.state.trashActive)
              ReactNativeHapticFeedback.trigger('impactHeavy', options);
            this.setState({trashActive: true});
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.trashActive) {
          //TODO : should be more of general purpose, not just delete.
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Cancel', 'Delete'],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 0,
            },
            idx => {
              if (idx === 1) {
                this.props.delete();
              }
            },
          );
        }
        this.props.disableScroll();
        Animated.parallel([
          Animated.timing(this.xWidth, {
            toValue: this.state.viewWidth,
            duration: 300,
          }),
          Animated.timing(this.xWidth2, {
            toValue: 0,
            duration: 300,
          }),
        ]).start();
        this.props.enableScroll();
      },
    });
  }
  state = {
    trashActive: false,
    viewWidth: 0,
    viewHeight: 0,
    initialWidth: 0,
    swipeActive: false,
    swipeIcon: 'ios-trash',
    swipeoutEnabled: this.props.swipeoutEnabled,
  };
  // TODO: Move the logic to parent. Should pass in boolean
  componentDidMount = () => {
    if (this.props.list && this.props.user) {
      this.props.list.isOwner ? null : this.setSwipeIcon('ios-exit');
    } else if (this.props.user) {
      this.setSwipeIcon('ios-close');
    }
  };

  setSwipeIcon = icon => {
    this.setState({swipeIcon: icon});
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.viewWidth !== state.viewWidth &&
      props.viewHeight !== state.viewHeight
    ) {
      return {
        viewWidth: props.viewWidth,
        viewHeight: props.viewHeight,
        initialWidth: props.viewWidth,
      };
    } else {
      return null;
    }
  }

  getRatio = dx => {
    return 1 - Math.abs(dx / this.state.viewWidth);
  };

  render() {
    const {trashActive} = this.state;

    return (
      <View style={[styles.container]}>
        <Animated.View
          style={[
            {
              height: this.props.swipeOutHeight,
              width: this.state.swipeActive
                ? this.xWidth
                : this.state.viewWidth,
            },
          ]}
          {...this._panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
        <Animated.View
          style={[
            styles.deleteView,
            {
              height: this.props.swipeOutHeight,
              width: this.xWidth2,
              backgroundColor: trashActive ? 'red' : 'gray',
            },
          ]}>
          <IoniconsIcon size={40} color={'white'} name={this.state.swipeIcon} />
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
  //  viewWidth: PropTypes.object.isRequired,
};
