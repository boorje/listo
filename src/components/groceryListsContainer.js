import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Badge} from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

const GroceryListItem = props => {
  return (
    <TouchableHighlight
      style={GroceryListItemStyles.container}
      backgroundColor={'white'}
      underlayColor={'transparent'}
      fontSize={50}
      onPress={() => props.goToGroceryList(props.item)}>
      <View style={GroceryListItemStyles.container2}>
        <Text style={GroceryListItemStyles.text}>{props.item.title}</Text>
        <Badge
          badgeStyle={{backgroundColor: 'black'}}
          textStyle={{fontSize: 20}}
          value={5}
        />
      </View>
    </TouchableHighlight>
  );
};

class GroceryList extends React.Component {
  swipeSettings = {
    autoClose: true,
  };
  renderList(item, index) {
    return (
      <Swipeout
        style={GroceryListStyles.swipeout}
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
        <GroceryListItem
          item={item}
          goToGroceryList={this.props.goToGroceryList}
        />
      </Swipeout>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={GroceryListStyles.separator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.lists}
          renderItem={({item, index}) => {
            return this.renderList(item, index);
          }}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.FlatListItemSeparator}
        />
      </View>
    );
  }
}

export default GroceryList;

const GroceryListStyles = StyleSheet.create({
  swipeout: {
    backgroundColor: 'transparent',
  },
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

const GroceryListItemStyles = StyleSheet.create({
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
