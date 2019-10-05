import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as colors from '../config/colors';

const Message = props => (
  <View style={styles.container}>
    <Icon size={34} name="warning" color="#fff" />
    <Text style={styles.message}>{props.message}</Text>
  </View>
);

export default Message;

Message.propTypes = {
  message: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: colors.errorColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    marginLeft: 20,
    fontSize: 16,
  },
});
