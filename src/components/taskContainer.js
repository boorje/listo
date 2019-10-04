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
  state = {
    lists: ['Adam', 'Eric', 'Simon'],
  };

  renderList(user) {
    return <Task name={user.item} selectTask={() => this.props.selectTask()} />;
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.lists}
          renderItem={user => {
            return this.renderList(user);
          }}
          keyExtractor={user => user}
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
