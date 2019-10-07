import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';

import {Badge} from 'react-native-elements';
import textStyles from '../styles/textStyles';

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
          <Text style={textStyles.default}>{this.props.name}</Text>
          <Badge
            badgeStyle={styles.badge}
            textStyle={{fontSize: 17}}
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
  badge: {
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: 'black',
  },
});
