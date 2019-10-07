import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';

import Swipeout from 'react-native-swipeout';
import Task from './task';

class TaskContainer extends React.Component {
  swipeSettings = {
    autoClose: true,
  };
  renderList(item, index) {
    return (
      <Swipeout
        style={styles.swipeout}
        {...this.swipeSettings}
        right={[
          {
            text: 'Delete',
            type: 'delete',
            onPress: () => {
              this.props.removeTask(index);
            },
          },
        ]}>
        <Task name={item} selectTask={() => this.props.selectTask()} />
      </Swipeout>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.lists}
          renderItem={({item, index}) => {
            return this.renderList(item, index);
          }}
          keyExtractor={item => item}
          ItemSeparatorComponent={this.FlatListItemSeparator}
        />
      </View>
    );
  }
}

export default TaskContainer;

const styles = StyleSheet.create({
  swipeout: {
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    width: '100%',
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
