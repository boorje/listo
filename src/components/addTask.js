import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import textStyles from '../styles/textStyles';

const AddTask = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{underlayColor: 'transparent'}}
        onPress={() => props.addTask()}>
        <Text style={textStyles.default}>Lägg till lista...</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    paddingLeft: '4%',
    marginTop: '3%',
  },
});
