import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Badge} from 'react-native-elements';

class Task extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.container}
        backgroundColor={'white'}
        underlayColor={'transparent'}
        fontSize={50}
        onPress={() => this.props.selectTask()}>
        <View style={styles.container2}>
          <Text style={styles.text}>{this.props.name}</Text>
          <Badge
            badgeStyle={{backgroundColor: 'black'}}
            textStyle={{fontSize: 20}}
            value={5}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

export default Task;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
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
    fontSize: 25,
  },
});
