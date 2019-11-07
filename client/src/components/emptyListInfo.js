import React from 'react';
import {StyleSheet, Dimensions, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import * as colors from '../styles/colors';

const {height, width} = Dimensions.get('window');

const EmptyListInfo = props => (
  <View style={styles.container}>
    <Text style={styles.emoji}>{props.emoji}</Text>
    <Text style={styles.textStyle}>
      Oops! It seems like your list is empty.
    </Text>
    <Text style={styles.textStyle}>Add items to get started!</Text>
  </View>
);

export default EmptyListInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  emoji: {fontSize: 50, marginBottom: '5%'},
  textStyle: {
    color: 'gray',
    fontSize: 17,
    textAlign: 'center',
  },
});
