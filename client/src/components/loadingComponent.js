import React, {useState, useEffect} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import * as colors from '../styles/colors';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {ValuesOfCorrectType} from 'graphql/validation/rules/ValuesOfCorrectType';

const {Value} = Animated;

export default function LoadingComponent(props) {
  const [icon1] = useState(new Value(0));
  const [icon2] = useState(new Value(0));
  const [icon3] = useState(new Value(0));
  const [icon4] = useState(new Value(0));

  function animate() {
    Animated.loop(
      Animated.stagger(100, [
        Animated.sequence([
          Animated.timing(icon1, {
            toValue: -100,
            duration: 500,
            friction: 1,
          }),
          Animated.timing(icon1, {
            toValue: 0,
            duration: 500,
            friction: 1,
          }),
        ]),
        Animated.sequence([
          Animated.timing(icon2, {
            toValue: -100,
            duration: 500,
            friction: 1,
          }),
          Animated.timing(icon2, {
            toValue: 0,
            duration: 500,
            friction: 1,
          }),
        ]),
        Animated.sequence([
          Animated.timing(icon3, {
            toValue: -100,
            duration: 500,
            friction: 1,
          }),
          Animated.timing(icon3, {
            toValue: 0,
            duration: 500,
            friction: 1,
          }),
        ]),
        Animated.sequence([
          Animated.timing(icon4, {
            toValue: -100,
            duration: 500,
            friction: 1,
          }),
          Animated.timing(icon4, {
            toValue: 0,
            duration: 500,
            friction: 1,
          }),
        ]),
      ]),
    ).start();
  }

  useEffect(() => {
    animate();
  }, []);

  function icon(name) {
    return (
      <IoniconsIcon
        style={styles.iconStyle}
        size={50}
        color={props.color}
        name={name}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.icons, {transform: [{translateY: icon1}]}]}>
        {icon('ios-ice-cream')}
      </Animated.View>
      <Animated.View style={[styles.icons, {transform: [{translateY: icon2}]}]}>
        {icon('ios-nutrition')}
      </Animated.View>
      <Animated.View style={[styles.icons, {transform: [{translateY: icon3}]}]}>
        {icon('ios-egg')}
      </Animated.View>
      <Animated.View style={[styles.icons, {transform: [{translateY: icon4}]}]}>
        {icon('ios-cart')}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icons: {padding: 15},
});

LoadingComponent.propTypes = {
  color: PropTypes.string.isRequired,
};
