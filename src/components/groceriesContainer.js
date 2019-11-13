import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  LayoutAnimation,
  Animated,
  RefreshControl,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
// components
import GroceryForm from './forms/groceryForm';
import EmptyListInfo from './emptyListInfo';
// styles
import textStyles from '../styles/textStyles';
import animations from '../styles/animations';
import * as colors from '../styles/colors';

const {Value} = Animated;
const {height, width} = Dimensions.get('window');

class GroceriesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.itemX = new Value(1);
  }
  state = {
    groceries: this.props.groceries,
    refreshing: false,
    removeId: '',
  };

  // ? enough comparison
  componentDidUpdate(prevProps) {
    const {groceries} = this.props;
    if (groceries.length !== prevProps.groceries.length) {
      this.setState({groceries: this.props.groceries});
    }
  }

  // ! When updating item. Can not open details before reload.
  // ! Sets the details = true correctly. Probably not re-rendering in renderItem()
  showGroceryForm = grocery => {
    const copy = this.state.groceries.map(item => {
      if (grocery.details || item.id !== grocery.id) {
        item.details = false;
      } else {
        item.details = true;
      }
      return item;
    });
    LayoutAnimation.configureNext(animations.default);
    this.setState({
      groceries: copy,
    });
  };

  renderItem(grocery) {
    return (
      <TouchableHighlight
        onLayout={e => {
          this.rowHeight = e.nativeEvent.layout.height;
        }}
        style={{flex: 1}}
        fontSize={50}
        onPress={() => {
          if (!this.props.addItemOpen) {
            this.props.removeGrocery(grocery.id);
          }
        }}
        underlayColor={'transparent'}>
        <Animated.View
          style={[
            styles.container2,
            {
              opacity: this.state.removeId === grocery.id ? this.itemX : 1,
            },
          ]}>
          <View style={{flex: 1, paddingLeft: '5%'}}>
            {grocery.details ? (
              <View>
                <GroceryForm
                  closeGroceryForm={() => {
                    this.showGroceryForm(grocery);
                  }}
                  addGrocery={this.props.updateGrocery}
                  item={grocery}
                  shouldCloseOnSubmit={true}
                />
              </View>
            ) : (
              <View style={styles.textInfo}>
                <Text style={textStyles.default}>{grocery.content}</Text>
                <Text style={textStyles.groceryDetails}>
                  {grocery.quantity}
                </Text>
                <Text style={textStyles.groceryDetails}>{grocery.unit}</Text>
              </View>
            )}
          </View>
          <Animated.View>
            <Icon
              size={32}
              name={!grocery.details ? 'expand-more' : 'expand-less'}
              color={'black'}
              onPress={() => {
                if (!this.props.addItemOpen) {
                  this.showGroceryForm(grocery);
                }
              }}
            />
          </Animated.View>
        </Animated.View>
      </TouchableHighlight>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.groceries}>
          {this.state.groceries.length === 0 && (
            <EmptyListInfo emoji={this.props.addItemOpen ? '😃' : '🥺'} />
          )}

          <KeyboardAwareFlatList
            ref="flatList"
            onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
            contentContainerStyle={{marginBottom: 10}}
            scrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                tintColor={colors.primaryColor}
                onRefresh={() => this.props.onRefresh()}
              />
            }
            data={this.props.groceries}
            renderItem={({item}) => this.renderItem(item)}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

export default GroceriesContainer;

const styles = StyleSheet.create({
  groceries: {
    position: 'absolute',
    top: '-9%',
    height: '110%',
    backgroundColor: 'white',
    paddingTop: '3%',
    width: '95%',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryColor,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    marginLeft: '3%',
    paddingRight: '3%',
    paddingBottom: '3%',
    marginRight: -1,
  },
  separator: {
    height: 3,
    width: '97%',
    marginLeft: '3%',
  },
  textInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

GroceriesContainer.propTypes = {
  groceries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  addGrocery: PropTypes.func.isRequired,
  updateGrocery: PropTypes.func.isRequired,
  removeGrocery: PropTypes.func.isRequired,
};
