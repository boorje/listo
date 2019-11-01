import React from 'react';
import {LayoutAnimation, StyleSheet, View} from 'react-native';
// components
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import ScreenHeader from '../components/screenHeader';
import PreviousGroceriesModal from './modals/previousGroceriesModal';
import ListSettingsModal from './modals/listSettingsModal';

// api
import {
  getGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from '../api/groceryListsAPI';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';

export default class ListScreen extends React.Component {
  state = {
    groceryList: {},
    groceries: [],
    user: {},
    apiError: '',
    listSettingsOpen: false,
    historyOpen: false,
    previousGroceries: [],
  };

  componentDidMount = async () => {
    try {
      const groceryList = await this.props.navigation.getParam(
        'groceryList',
        null,
      );
      await this.fetchListItems(groceryList.id);
      this.setState({groceryList});
      const user = await this.props.navigation.getParam('user', null);
      this.setState({user});
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
            quantity: quantity.length > 0 ? quantity : null,
            unit: unit.length > 0 ? unit : null,
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
      const stateCopy = this.state.groceries.map(grocery => {
        if (grocery.id === res.id) {
          updatedGrocery.details = false;
          return updatedGrocery;
        }
        return grocery;
      });
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  openListSettings = () => {
    this.setState({
      listSettingsOpen: this.state.listSettingsOpen ? false : true,
    });
  };

  openGroceryHistory = () => {
    this.setState({historyOpen: this.state.historyOpen ? false : true});
  };

  render() {
    const {
      apiError,
      groceries,
      groceryList,
      historyOpen,
      listSettingsOpen,
      user,
    } = this.state;
    return (
      <View style={styles.container}>
        {historyOpen && (
          <PreviousGroceriesModal
            closeModal={() => this.openGroceryHistory()}
          />
        )}
        {listSettingsOpen && (
          <ListSettingsModal
            groceryList={groceryList}
            user={user}
            closeModal={() => this.openListSettings()}
          />
        )}
        {apiError.length > 0 && <Message message={apiError} />}
        <ScreenHeader
          leftIconPress={() => this.props.navigation.goBack()}
          rightIcon1Press={() => this.openGroceryHistory()}
          rightIcon2Press={() => this.openListSettings()}
          headerTitle={groceryList.title}
          leftIcon={'ios-arrow-round-back'}
          //rightIcon1={'md-hourglass'}
          rightIcon2={'md-person-add'}
          background={BACKGROUND_URL}
        />

        <View style={styles.separator} />
        <GroceriesContainer
          groceries={groceries}
          addGrocery={this.addGrocery}
          updateGrocery={this.updateGrocery}
          removeGrocery={this.removeGrocery}
          navigation={this.props.navigation}
          onRefresh={() => this.fetchListItems(groceryList.id)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3E3E3',
  },
  separator: {
    height: 1,
    backgroundColor: '#808080',
    opacity: 0.5,
    marginBottom: '2%',
  },
});
