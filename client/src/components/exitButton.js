import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import * as colors from '../styles/colors';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

export default function ExitButton(props) {
  return (
    <View style={styles.button}>
      <IoniconsIcon
        size={50}
        color={props.color}
        name={'ios-close'}
        onPress={() => props.exit()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: '10%',
    top: '6%',
    zIndex: 1,
  },
});
