import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import textStyles from '../../styles/textStyles';
import * as colors from '../../styles/colors';

const PrimaryButton = props => {
  const {disabled, title, onPress} = props;
  return (
    <TouchableHighlight
      onPress={() => onPress()}
      disabled={disabled ? disabled : false}
      underlayColor={colors.primaryColorFaded}
      style={styles.button}>
      <Text style={textStyles.button}>{title}</Text>
    </TouchableHighlight>
  );
};

export default PrimaryButton;

PrimaryButton.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  containerStyle: {margin: 20, height: 50},
  button: {
    height: 60,
    backgroundColor: colors.primaryColor,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
