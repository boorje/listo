import React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import Item from './item';
import Icon from 'react-native-vector-icons/MaterialIcons';

class ItemContainer extends React.Component {
  renderList(item) {
    return (
      <Item name={item.item} addItem={content => this.props.addItem(content)} />
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.items}
          renderItem={item => {
            return this.renderList(item);
          }}
          keyExtractor={item => item}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  }
}

export default ItemContainer;

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
