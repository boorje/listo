import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  LayoutAnimation,
  SafeAreaView,
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
    groceries: [],
    adjustFooter: false,
    addItemOpen: false,
  };

  componentDidMount = () => {
    console.log(this.props.groceries);
    this.setState({groceries: this.props.groceries});
  };

  showGroceryForm = grocery => {
    console.log(grocery);
    if (this.state.addItemOpen) {
      this.setState({adjustFooter: false, addItemOpen: false});
    }
    console.log(this.state.groceries);
    const copy = this.state.groceries.map(item => {
      if (grocery.details || item.id !== grocery.id) {
        console.log('false');
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
          <Icon
            size={32}
            name={!grocery.details ? 'expand-more' : 'expand-less'}
            color={'black'}
            onPress={() => {
              this.showGroceryForm(grocery);
            }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 8}}>
          <KeyboardAwareFlatList
            scrollEnabled={true}
            data={this.props.groceries}
            renderItem={({item}) => this.renderItem(item)}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyboardShouldPersistTaps="always"
          />
        </View>
        <View
          style={{
            justifyContent: !this.state.adjustFooter ? 'center' : 'flex-start',
            flex: !this.state.adjustFooter ? 1 : 10,
            borderTopWidth: 0.5,
            paddingBottom: 0,
          }}>
          <AddGroceryFooter
            addGrocery={this.props.addGrocery}
            addItemOpen={this.state.addItemOpen}
            showAddGrocery={this.showAddGrocery}
          />
        </View>
      </SafeAreaView>
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
  text: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
  },
});

GroceriesContainer.propTypes = {
  groceries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  addGrocery: PropTypes.func.isRequired,
  updateGrocery: PropTypes.func.isRequired,
  removeGrocery: PropTypes.func.isRequired,
};
