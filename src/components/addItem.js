import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const AddItem = props => {
  return (
    <View style={styles.container}>
      <TouchableHighlight>
        <Text>Lägg till vara...</Text>
      </TouchableHighlight>
      <View style={{flexDirection: 'row'}}>
        <Icon size={32} name={'camera'} color={'black'} onPress={() => {}} />
        <Icon size={32} name={'image'} color={'black'} onPress={() => {}} />
      </View>
    </View>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    marginTop: '3%',
  },
});
