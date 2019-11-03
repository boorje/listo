import React from 'react';
import {LayoutAnimation, StyleSheet, View} from 'react-native';
// components
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import ScreenHeader from '../components/screenHeader';
import PreviousGroceriesModal from './modals/previousGroceriesModal';
import ListSettingsModal from './modals/listSettingsModal';
import animations from '../styles/animations';
import * as colors from '../styles/colors';
import AddGroceryFooter from '../components/addGroceryFooter';

// api
import {
  getGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from '../api/groceryListsAPI';

export default class ListScreen extends React.Component {
  state = {
    groceryList: {},
    groceries: [],
    // groceries: [ //! MOCK DATA
    //   {id: 1, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 2, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 3, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 4, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 5, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 6, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 7, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 8, content: 'bärs', quantity: 3, unit: 'flak'},
    //   {id: 9, content: 'bärs', quantity: 3, unit: 'flak'},
    // ],
    user: {},
    apiError: '',
    listSettingsOpen: false,
    historyOpen: false,
    previousGroceries: [],
    addItemOpen: false,
    messageOpen: false,
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
      this.setState({messageOpen: true});
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
      LayoutAnimation.configureNext(animations.default);
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
      this.setState({messageOpen: true});
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
      LayoutAnimation.configureNext(animations.default);
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.setState({apiError: error});
      this.setState({messageOpen: true});
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
      this.setState({messageOpen: true});
    }
  };
  showAddGrocery = () => {
    if (this.state.addItemOpen === false) {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: true});
    } else {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: false});
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
  toggleMessage = () => {
    this.setState(prevstate => ({
      messageOpen: prevstate.messageOpen ? false : true,
    }));
  };

  render() {
    const {
      apiError,
      groceries,
      groceryList,
      historyOpen,
      listSettingsOpen,
      user,
      messageOpen,
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
        {apiError.length > 0 && messageOpen && (
          <Message
            messageOpen={() => this.toggleMessage()}
            message={apiError}
          />
        )}
        <ScreenHeader
          leftIconPress={() => this.props.navigation.goBack()}
          rightIcon1Press={() => this.openGroceryHistory()}
          rightIcon2Press={() => this.openListSettings()}
          headerTitle={groceryList.title}
          leftIcon={'ios-arrow-round-back'}
          //rightIcon1={'md-hourglass'}
          rightIcon2={'md-person-add'}
        />
        <View style={{flex: 11}}>
          <GroceriesContainer
            groceries={groceries}
            addGrocery={this.addGrocery}
            updateGrocery={this.updateGrocery}
            removeGrocery={this.removeGrocery}
            navigation={this.props.navigation}
            addItemOpen={this.state.addItemOpen}
            onRefresh={() => this.fetchListItems(groceryList.id)}
          />
        </View>
        <View style={styles.footer}>
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
    backgroundColor: colors.secondaryColor,
  },
  footer: {
    bottom: 0,
    flex: 2,
    justifyContent: 'center',
  },
});
