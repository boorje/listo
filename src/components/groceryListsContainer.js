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
import LinearGradient from 'react-native-linear-gradient';

const listHeight = 100;

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
        style={[styles.container]}
        underlayColor="transparent"
        fontSize={50}>
        <Swipeout
          swipeOutHeight={listHeight}
          list={this.props.item}
          user={this.props.user}
          swipeoutEnabled={true}
          disableScroll={() => {}}
          enableScroll={() => {}}
          viewWidth={this.state.viewWidth}
          delete={() => this.props.removeGroceryList()}>
          <TouchableWithoutFeedback
            onPress={() => this.props.goToGroceryList(this.props.item)}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={colors.testShade}
              style={styles.container2}>
              <View style={styles.leftText}>
                <Text
                  style={[
                    textStyles.default,
                    {color: 'white', fontWeight: '600'},
                  ]}>
                  {this.props.item.title}
                </Text>
                <Text
                  style={[textStyles.default, {color: 'white', fontSize: 12}]}>
                  Created: 2019-12-24
                </Text>
              </View>
              <View style={styles.rightText}>
                <Text
                  style={[
                    textStyles.default,
                    {fontSize: 25, color: 'white', fontWeight: '600'},
                  ]}>
                  8
                </Text>
                <Text
                  style={[textStyles.default, {fontSize: 13, color: 'white'}]}>
                  items
                </Text>
              </View>

              {/* <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  width: 60,
                  height: 60,
                  borderRadius: 40,
                  right: '6%',
                  top: '25%',
                  zIndex: -1,
                }}
              /> */}
            </LinearGradient>
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
        style={{paddingTop: '5%'}}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '97%',
    height: listHeight,
    marginLeft: '3%',
    marginBottom: '5%',
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: listHeight,
    width: '100%',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,

    overflow: 'hidden',
  },
  swipeout: {
    backgroundColor: 'transparent',
  },
  leftText: {
    position: 'absolute',
    top: '25%',
    left: 20,
  },
  rightText: {
    position: 'absolute',
    top: '25%',
    right: '10%',
    alignItems: 'center',
  },
});

GroceryListsContainer.propTypes = {
  goToGroceryList: PropTypes.func.isRequired,
  removeGroceryList: PropTypes.func.isRequired,
  groceryLists: PropTypes.array.isRequired,
};
