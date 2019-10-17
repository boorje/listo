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
      underlayColor={'transparent'}
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
              this.props.removeGroceryList(item.id);
            },
          },
        ]}>
        <GroceryListItem
          item={item}
          goToGroceryList={this.props.goToGroceryList}
          numberOfItems={this.props.numberOfItems}
        />
      </Swipeout>
    );
  }

  render() {
    return (
      <KeyboardAwareFlatList
        data={this.props.lists}
        renderItem={({item, index}) => {
          return this.renderList(item, index);
        }}
        keyExtractor={item => item.id}
      />
    );
  }
}

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
  },
  separator: {
    height: 2,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: '#607D8B',
  },
});

const GroceryListItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: '2%',
    width: '95%',
    alignSelf: 'center',
    marginBottom: '3%',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE9501',
    opacity: 0.6,
    borderRadius: 50,
    width: 30,
    height: 30,
  },
});

GroceryListsContainer.propTypes = {
  goToGroceryList: PropTypes.func.isRequired,

  removeGroceryList: PropTypes.func.isRequired,
  lists: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
