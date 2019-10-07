import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import * as colors from '../../config/colors';

const PrimaryButton = props => {
  const {disabled, title, onPress, loading} = props;
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      disabled={disabled ? disabled : false}
      style={[
        styles.button,
        {backgroundColor: disabled ? '#aaa' : colors.submitColor},
      ]}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;

PrimaryButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    height: 59,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
