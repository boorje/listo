import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import textStyles from '../../styles/textStyles';

const PrimaryButton = props => {
  const {disabled, title, onPress} = props;
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      disabled={disabled ? disabled : false}
      style={styles.button}>
      <Text style={textStyles.button}>{title}</Text>
    </TouchableOpacity>
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
    height: 59,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
