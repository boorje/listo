import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  LayoutAnimation,
  SafeAreaView,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

// -- Components --
import AddGroceryFooter from '../components/addGroceryFooter';
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';

import animations from '../styles/animations';

// -- API helpers --
import {
  getGroceryList,
  updateGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from '../api/groceryListsAPI';

import {getUserID} from '../api/authAPI';

// TODO: Create custom animation class

export default class ListScreen extends React.Component {
  // ! TODO: Create custom header
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: navigation.state.params.title,
      headerRight: (
        <IoniconsIcon
          size={28}
          name="md-settings"
          onPress={() => {
            navigation.navigate('ListSettings', {
              groceryList: navigation.state.params.groceryList,
            });
          }}
          style={{marginRight: 15}}
        />
      ),
    };
  };

  state = {
    groceryList: {},
    groceries: [],
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
      this.props.navigation.setParams({
        title: groceryList.title,
        groceryList: groceryList,
      });
      await this.fetchListItems(groceryList.id);
      this.setState({groceryList});
    } catch (error) {
      this.setState({
        apiError: error
          ? error
          : 'Could not fetch list items. Please try again. ',
      });
    }
  };

  fetchListItems = async listId => {
    try {
      const groceries = await getGroceryList(listId);
      this.setState({groceries});
    } catch (error) {
      if (error.errors) {
        if (error.errors[0].message === 'Network Error') {
          throw 'Network error. Please check your connection.';
        }
      }
      throw 'Could not fetch lists. Please try again.';
    }
  };

  addGrocery = async grocery => {
    try {
      const newGroceryItemID = await createGroceryItem(
        grocery,
        this.state.groceryList.id,
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
            id: newGroceryItemID,
          },
        ],
      });
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  removeGrocery = async id => {
    try {
      const deletedGrocery = await deleteGroceryItem(id);
      if (!deletedGrocery || deletedGrocery === null) {
        throw 'Could not remove item. Please try again.';
      }
      const stateCopy = this.state.groceries.filter(
        grocery => grocery.id !== deletedGrocery.id,
      );
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  updateGrocery = async updatedGrocery => {
    try {
      const res = await updateGroceryItem(updatedGrocery);
      console.log(res);
      const stateCopy = this.state.groceries.map(grocery => {
        if (grocery.id === res.id) {
          return updatedGrocery;
        }
        return grocery;
      });
      this.setState({groceries: stateCopy});
    } catch (error) {
      console.log(error);
      this.setState({apiError: error});
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

  render() {
    const {apiError, groceries} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.scrollView}>
          {apiError.length > 0 && <Message message={apiError} />}
          <SafeAreaView style={{flex: 8}}>
            <GroceriesContainer
              items={groceries}
              updateGrocery={this.updateGrocery}
              removeGrocery={this.removeGrocery}
              showGroceryForm={this.showGroceryForm}
            />
          </SafeAreaView>
        </View>
        <View
          style={{
            justifyContent: !this.state.adjustFooter ? 'center' : 'flex-start',
            flex: !this.state.adjustFooter ? 1 : 10,
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 8,
  },
  footer: {
    justifyContent: 'center',
    flex: 1,
    borderTopWidth: 0.5,
    paddingBottom: 0,
  },
});
