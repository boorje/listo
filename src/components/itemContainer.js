import React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import Item from './item';

class ItemContainer extends React.Component {
  state = {
    items: ['Cola', 'Bärs', 'Kiwi'],
  };

  renderList(item) {
    return <Item name={item.item} />;
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.items}
          renderItem={item => {
            return this.renderList(item);
          }}
          keyExtractor={item => item}
          ItemSeparatorComponent={this.FlatListItemSeparator}
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
