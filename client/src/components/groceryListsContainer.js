import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import Swipeout from '../components/swipeout';
import textStyles from '../styles/textStyles';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import * as colors from '../styles/colors';

class GroceryListItem extends React.Component {
  state = {
    viewWidth: 0,
    viewHeight: 0,
  };

  render() {
    return (
      <View
        onLayout={event => {
          var {height, width} = event.nativeEvent.layout;
          this.setState({viewWidth: width, viewHeight: height});
        }}
        style={[GroceryListItemStyles.container]}
        underlayColor="transparent"
        fontSize={50}>
        <Swipeout
          list={this.props.item}
          user={this.props.user}
          swipeoutEnabled={true}
          disableScroll={() => {}}
          enableScroll={() => {}}
          viewWidth={this.state.viewWidth}
          delete={() => this.props.removeGroceryList()}>
          <TouchableWithoutFeedback
            onPress={() => this.props.goToGroceryList(this.props.item)}>
            <View style={GroceryListItemStyles.container2}>
              <Text style={textStyles.default}>{this.props.item.title}</Text>
              {/* {this.props.isShared && (
                <Icon size={30} name={'people'} color={'black'} />
              )} */}
            </View>
          </TouchableWithoutFeedback>
        </Swipeout>
      </View>
    );
  }
}

export default class GroceryListsContainer extends React.Component {
  state = {
    refreshing: false,
  };
  renderList({list}) {
    return (
      <GroceryListItem
        user={this.props.user}
        isShared={list.owner === this.props.user.id ? true : false} // TODO: When possible, adjust
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
        style={{paddingTop: '3%'}}
        data={this.props.groceryLists}
        renderItem={({item}) => {
          return this.renderList(item);
        }}
        keyExtractor={({list}) => list.id}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            tintColor={colors.primaryColor}
            onRefresh={() => this.props.onRefresh()}
          />
        }
      />
    );
  }
}

const GroceryListItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryColor,
    width: '97%',
    marginLeft: '3%',
    marginBottom: '3%',
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    shadowOpacity: 0.5,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
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