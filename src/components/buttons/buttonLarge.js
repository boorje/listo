import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import * as colors from '../../config/colors';

const ButtonLarge = props => {
  const {loading, disabled, title, type, onPress} = props;
  let buttonStyles = {height: 60};
  if (type === 'submit') {
    buttonStyles.backgroundColor = colors.submitColor;
  } else {
    buttonStyles.backgroundColor = colors.primaryColor;
  }
  return (
    <Button
      title={title}
      onPress={() => onPress()}
      disabled={disabled ? disabled : false}
      buttonStyle={buttonStyles}
      containerStyle={styles.containerStyle}
      loading={loading ? loading : false}
    />
  );
};

export default ButtonLarge;

ButtonLarge.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  containerStyle: {margin: 20, height: 50},
});
