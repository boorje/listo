import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const addGroceryListButton = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{underlayColor: 'transparent'}}
        onPress={() => props.addGroceryList()}>
        <Text>Lägg till vara...</Text>
      </TouchableOpacity>
    </View>
  );
};

export default addGroceryListButton;

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
