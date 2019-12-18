import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Modal,
  PanResponder,
  View,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../../styles/textStyles';

export default function OverlayModal(props) {
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [fullyOpen, toggleFullyOpen] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const [translateX, translateY] = [0, pan.y];
  const viewStyle = {transform: [{translateX}, {translateY}]};
  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      if (fullyOpen) {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      }
      pan.setValue({x: 0, y: 0});
    },
    onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
    onPanResponderRelease: (evt, gestureState) => {
      // Modal half open
      if (!fullyOpen) {
        if (pan.y._value <= -screenHeight / 7) {
          Animated.timing(pan, {
            toValue: {x: 0, y: (-screenHeight * 0.65) / 2},
            duration: 100,
          }).start();
          toggleFullyOpen(true);
        } else if (pan.y._value >= screenHeight / 7) {
          props.closeModal();
        } else {
          Animated.timing(pan, {
            toValue: {x: 0, y: 0},
            duration: 100,
          }).start();
        }
      }
      //Modal fully open
      else {
        if (pan.y._value >= screenHeight / 3.5) {
          props.closeModal();
        } else if (pan.y._value >= screenHeight / 8) {
          pan.flattenOffset();
          Animated.timing(pan, {
            toValue: {x: 0, y: 0},
            duration: 100,
          }).start();
          toggleFullyOpen(false);
        } else {
          pan.flattenOffset();
          Animated.timing(pan, {
            toValue: {x: 0, y: -(screenHeight * 0.65) / 2},
            duration: 100,
          }).start();
        }
      }
      pan.flattenOffset();
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
  });

  useEffect(() => {
    if (props.expandModal) expandModal();
  }, [props.expandModal]);

  function expandModal() {
    Animated.timing(pan, {
      toValue: {x: 0, y: (-screenHeight * 0.65) / 2},
      duration: 300,
    }).start();
    toggleFullyOpen(true);
  }

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <Animated.View style={[viewStyle, styles.container]}>
        <View style={styles.handleContainer} {..._panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        <View style={styles.closeIcon}>
          <IoniconsIcon
            size={35}
            color={'rgba(52, 52, 52, 1)'}
            name={'ios-close-circle'}
            onPress={() => props.closeModal()}
          />
        </View>
        <View style={styles.headline}>
          <Text style={textStyles.modalTitle}>{props.modalTitle}</Text>
        </View>
        {props.children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    height: '100%',
    top: '50%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  touchableOpacity: {
    flex: 1,
  },
  handleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '5%',
  },
  dragHandle: {
    height: 4,
    width: '35%',
    backgroundColor: 'rgba(52, 52, 52, 1)s',
    borderRadius: 10,
    alignSelf: 'center',
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 1,
    top: '1%',
    right: '5%',
  },
  headline: {
    alignItems: 'center',
  },
});
