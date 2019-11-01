import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  LayoutAnimation,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
// components
import AddGroceryFooter from '../components/addGroceryFooter';
import GroceryForm from './forms/groceryForm';
// styles
import textStyles from '../styles/textStyles';
import animations from '../styles/animations';

class GroceriesContainer extends React.Component {
  state = {
    groceries: this.props.groceries,
    adjustFooter: false,
    addItemOpen: false,
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
    if (this.state.addItemOpen) {
      this.setState({adjustFooter: false, addItemOpen: false});
    }
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

  showAddGrocery = () => {
    if (this.state.addItemOpen === false) {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: true});
    } else {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: false});
    }
    this.adjustFooter();
  };

  adjustFooter = () => {
    // Move to method above?
    LayoutAnimation.configureNext(animations.default);
    this.setState({adjustFooter: !this.state.adjustFooter ? true : false});
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
          this.props.removeGrocery(grocery.id);
        }}
        underlayColor={'transparent'}>
        <View style={styles.container2}>
          <View style={{flex: 1}}>
            {grocery.details ? (
              <GroceryForm
                closeGroceryForm={() => this.showGroceryForm(grocery)}
                addGrocery={this.props.updateGrocery}
                item={grocery}
                shouldCloseOnSubmit={true}
              />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                if (!this.state.addItemOpen) {
                  this.showGroceryForm(grocery);
                }
              }}
            />
          </Animated.View>
        </View>
      </TouchableHighlight>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 8}}>
          <KeyboardAwareFlatList
            ref="flatList"
            onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
            scrollEnabled={true}
            data={this.props.groceries}
            renderItem={({item}) => this.renderItem(item)}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyboardShouldPersistTaps="always"
          />
        </View>
        <View style={[styles.footer, {justifyContent: 'center', flex: 1}]}>
          <AddGroceryFooter
            addGrocery={this.props.addGrocery}
            addItemOpen={this.state.addItemOpen}
            showAddGrocery={this.showAddGrocery}
          />
        </View>
      </View>
    );
  }
}

export default GroceriesContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  separator: {
    height: 0.5,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: '#607D8B',
  },
  container1: {
    flex: 1,
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
  footer: {
    paddingBottom: 0,
  },
});

GroceriesContainer.propTypes = {
  groceries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  addGrocery: PropTypes.func.isRequired,
  updateGrocery: PropTypes.func.isRequired,
  removeGrocery: PropTypes.func.isRequired,
};
