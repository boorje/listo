import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as colors from '../styles/colors';

const Message = props => (
  <View
    style={[
      styles.wrapper,
      {
        backgroundColor:
          props.type === 'SUCCESS' ? colors.submitColor : colors.errorColor,
      },
    ]}>
    <Icon size={34} name="warning" color="#fff" />
    <Text style={styles.message}>{props.message}</Text>
  </View>
);

export default Message;

Message.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
};

const styles = StyleSheet.create({
  wrapper: {
    padding: '8%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    color: '#fff',
    marginLeft: 20,
    fontSize: 16,
  },
});
