import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import * as colors from '../../styles/colors';
import textStyles from '../../styles/textStyles';

const PrimaryButton = props => {
  const {disabled, title, onPress, loading} = props;
  return (
    <TouchableHighlight
      onPress={() => onPress()}
      disabled={disabled ? disabled : false}
      underlayColor={colors.primaryColorFaded}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#aaa' : 'white',
        },
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Text
          style={[textStyles.button, {color: disabled ? 'white' : 'black'}]}>
          {title}
        </Text>
      )}
    </TouchableHighlight>
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
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '70%',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
