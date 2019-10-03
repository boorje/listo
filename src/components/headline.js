import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Headline = props => {
  return (
    <View style={styles.headline}>
      <Text style={styles.text}>{props.title}</Text>
    </View>
  );
};

export default Headline;

const styles = StyleSheet.create({
  headline: {
    height: '5%',
    backgroundColor: 'blue',
    justifyContent: 'center',
  },
  text: {
    paddingLeft: '3%',
    fontSize: 30,
    color: 'white',
  },
});
