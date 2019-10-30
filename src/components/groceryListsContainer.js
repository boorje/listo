import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Swipeout from '../components/swipeout';
import textStyles from '../styles/textStyles';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from 'react-native-gesture-handler';

class GroceryListItem extends React.Component {
  state = {
    viewWidth: 0,
    viewHeight: 0,
  };
  render() {
    return (
      <TouchableHighlight
        onLayout={event => {
          var {height, width} = event.nativeEvent.layout;
          this.setState({viewWidth: width, viewHeight: height});
        }}
        style={[GroceryListItemStyles.container]}
        underlayColor="transparent"
        fontSize={50}
        onPress={() => this.props.goToGroceryList(this.props.item)}>
        <Swipeout
          viewWidth={this.state.viewWidth}
          onPress={() => this.props.goToGroceryList(this.props.item)}
          delete={() => this.props.removeGroceryList()}>
          <View style={GroceryListItemStyles.container2}>
            <Text style={textStyles.default}>{this.props.item.title}</Text>
            <View style={GroceryListItemStyles.badge}>
              {/* // TODO: add dynamic item count */}
              <Text style={textStyles.badge}>{this.props.numberOfItems}</Text>
            </View>
          </View>
        </Swipeout>
      </TouchableHighlight>
    );
  }
}

export default class GroceryListsContainer extends React.Component {
  renderList({list}) {
    return (
      <GroceryListItem
        item={list}
        goToGroceryList={this.props.goToGroceryList}
        numberOfItems={this.props.numberOfItems}
        removeGroceryList={() => this.props.removeGroceryList({list})}
      />
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
    width: '97%',
    marginLeft: '3%',
    marginBottom: '3%',
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '3%',
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
