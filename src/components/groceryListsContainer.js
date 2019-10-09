import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Swipeout from 'react-native-swipeout';
import textStyles from '../styles/textStyles';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

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
        <View style={GroceryListItemStyles.badge}>
          {/* // TODO: add dynamic item count */}
          <Text style={textStyles.badge}>5</Text>
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
        />
      </Swipeout>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={GroceryListStyles.separator} />;
  };

  render() {
    return (
      <KeyboardAwareFlatList
        data={this.props.lists}
        renderItem={({item, index}) => {
          return this.renderList(item, index);
        }}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={this.FlatListItemSeparator}
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
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 50,
    width: 30,
    height: 30,
  },
});

GroceryListsContainer.propTypes = {
  goToGroceryList: PropTypes.func.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  removeTask: PropTypes.func.isRequired,
  lists: PropTypes.arrayOf(PropTypes.object).isRequired,
};
