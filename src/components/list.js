import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Badge} from 'react-native-elements';

class List extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.container}
        backgroundColor={'white'}
        underlayColor={'transparent'}
        fontSize={50}
        onPress={() => {}}>
        <View style={styles.container2}>
          <Text style={styles.text}>{this.props.name}</Text>
          <Badge value={3} />
        </View>
      </TouchableHighlight>
    );
  }
}

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingBottom: '3%',
  },
  text: {
    fontSize: 20,
  },
});
