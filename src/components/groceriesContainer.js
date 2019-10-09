import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutAnimation,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GroceryForm from './forms/groceryForm';
import textStyles from '../styles/textStyles';
import animations from '../styles/animations';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import AddGroceryFooter from '../components/addGroceryFooter';

// -- API helpers --
import {
  getGroceryList,
  updateGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from '../api/groceryListsAPI';

class GroceriesContainer extends React.Component {
  state = {
    groceries: [],
    groceryListID: '',
    apiError: '',
    adjustFooter: false,
    addItemOpen: false,
  };

  componentDidMount = async () => {
    try {
      const groceryList = await this.props.navigation.getParam(
        'groceryList',
        null,
      );
      this.setState({groceryListID: groceryList.id});
      this.props.navigation.setParams({title: groceryList.title});
      const groceries = await getGroceryList(groceryList.id);
      if (groceries) {
        groceries.details = false;
        this.setState({groceries});
      }
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  addGrocery = async grocery => {
    try {
      const newGroceryID = await createGroceryItem(
        grocery,
        this.state.groceryListID,
      );
      const {content, quantity, unit} = grocery;
      LayoutAnimation.spring();
      this.setState({
        groceries: [
          ...this.state.groceries,
          {
            content,
            quantity,
            unit,
            details: false,
            id: newGroceryID,
          },
        ],
      });
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  removeGrocery = async id => {
    try {
      const deleteGrocery = await deleteGroceryItem(id);
      const stateCopy = this.state.groceries.filter(
        grocery => grocery.id !== deleteGrocery.id,
      );
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  updateGrocery = async updatedGrocery => {
    try {
      const res = await updateGroceryItem(updatedGrocery);
      const stateCopy = this.state.groceries.map(grocery => {
        if (grocery.id === res.id) {
          grocery.content = updatedGrocery.content;
          grocery.quantity = updatedGrocery.quantity;
          grocery.unit = updatedGrocery.unit;
        }
        return grocery;
      });
      LayoutAnimation.spring();
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  showGroceryForm = (grocery, index) => {
    if (this.state.addItemOpen) {
      this.setState({adjustFooter: false, addItemOpen: false});
    }
    let groceriesCopy = [...this.state.groceries];
    if (grocery.details) {
      groceriesCopy[index].details = false;
    } else {
      groceriesCopy[index].details = true;
    }
    LayoutAnimation.configureNext(animations.default);
    this.setState({
      groceries: groceriesCopy,
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

  renderList(item, index) {
    return (
      <TouchableHighlight
        style={styles.container1}
        fontSize={50}
        onPress={() => {
          this.removeGrocery(item.id);
        }}
        underlayColor={'transparent'}>
        <View style={styles.container2}>
          {!item.details ? (
            <Text style={textStyles.default}>{item.content}</Text>
          ) : (
            <GroceryForm
              closeGroceryForm={() => this.showGroceryForm(item, index)}
              addGrocery={this.updateGrocery}
              item={item}
            />
          )}
          <Icon
            size={32}
            name={!item.details ? 'expand-more' : 'expand-less'}
            color={'black'}
            onPress={() => {
              this.showGroceryForm(item, index);
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
            data={this.state.groceries}
            renderItem={({item, index}) => {
              return this.renderList(item, index);
            }}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyboardShouldPersistTaps="always"
          />
        </View>
        <View
          style={{
            justifyContent: !this.state.adjustFooter ? 'center' : 'flex-start',
            flex: !this.state.adjustFooter ? 1 : 9,
            paddingTop: !this.state.adjustFooter ? 0 : 20,
            borderTopWidth: 0.5,
            paddingBottom: 0,
          }}>
          <AddGroceryFooter
            addGrocery={this.addGrocery}
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
    height: 1,
    width: '97%',
    marginLeft: '3%',
    marginRight: '0%',
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
  updateApiError: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};
