import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import PropTypes from 'prop-types';
import Swipeout from 'react-native-swipeout';
import textStyles from '../styles/textStyles';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

const GroceryListItem = props => {
  return (
    <TouchableHighlight
      style={GroceryListItemStyles.container}
      underlayColor="transparent"
      fontSize={50}
      onPress={() => props.goToGroceryList(props.item)}>
      <View style={GroceryListItemStyles.container2}>
        <Text style={textStyles.default}>{props.item.title}</Text>
        <View style={GroceryListItemStyles.badge}>
          {/* // TODO: add dynamic item count */}
          <Text style={textStyles.badge}>{props.numberOfItems}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default class GroceryListsContainer extends React.Component {
  swipeSettings = {
    autoClose: true,
    sensitivity: 50,
    buttonWidth: 100,
  };
  renderList({list}) {
    return (
      <Swipeout
        style={GroceryListItemStyles.swipeout}
        {...this.swipeSettings}
        right={[
          {
            text: 'Remove', // TODO: Check if owner of list
            type: 'delete',
            onPress: () => {
              this.props.removeGroceryList({list});
            },
          },
        ]}>
        <GroceryListItem
          item={list}
          goToGroceryList={this.props.goToGroceryList}
          numberOfItems={this.props.numberOfItems}
        />
      </Swipeout>
    );
  }

  render() {
    return (
      <KeyboardAwareFlatList
        data={this.props.groceryLists}
        renderItem={({item}) => {
          return this.renderList(item);
        }}
        keyExtractor={({list}) => list.id}
      />
    );
  }
}

const GroceryListItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: '3%',
    width: '97%',
    marginLeft: '3%',
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swipeout: {
    backgroundColor: 'transparent',
    marginBottom: '2%',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06BA63',
    borderRadius: 50,
    width: 30,
    height: 30,
  },
});

GroceryListsContainer.propTypes = {
  goToGroceryList: PropTypes.func.isRequired,
  removeGroceryList: PropTypes.func.isRequired,
  groceryLists: PropTypes.array.isRequired,
};
