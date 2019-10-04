import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  Button,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Task from './task';

class TaskContainer extends React.Component {
  renderList(task) {
    return <Task name={task.item} selectTask={() => this.props.selectTask()} />;
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.lists}
          renderItem={task => {
            return this.renderList(task);
          }}
          keyExtractor={task => task}
          ItemSeparatorComponent={this.FlatListItemSeparator}
        />
      </View>
    );
  }
}

export default TaskContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  separator: {
    height: 2,
    width: '97%',
    marginLeft: '3%',
    marginRight: '0%',
    backgroundColor: '#607D8B',
  },
});
