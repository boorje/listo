import React from 'react';
import {StyleSheet, View, Image, SafeAreaView, Text} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

// -- Components --
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import HomeScreenBackground from '../components/homeScreenBackground';
import SettingsModal from './modals/settingsModal';

// -- API helpers --
import {
  getGroceryList,
  createGroceryList,
  listGroceryLists,
  deleteGroceryList,
} from '../api/groceryListsAPI';

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  state = {
    modalOpen: false,
    settingsOpen: false,
    groceryLists: [],
    apiError: '',
    numberOfItems: 8,
  };

  componentDidMount = async () => {
    try {
      // const groceryLists = await listGroceryLists();
      const groceryLists = [{id: 1, title: 'Adam'}]; //! REMOVE
      const groceries = groceryLists.map(
        list => getGroceryList(list.id).length,
      );
      console.log(groceries);
      this.setState({groceryLists});
    } catch (error) {
      this.setState({apiError: 'Kunde inte hämta listor. Försök igen.'});
    }
  };

  toggleModal = () => {
    this.setState(prevstate => ({
      modalOpen: prevstate.modalOpen ? false : true,
    }));
  };

  openSettings = () => {
    this.setState({settingsOpen: this.state.settingsOpen ? false : true});
  };

  addGroceryList = async title => {
    try {
      const res = await createGroceryList({
        title,
      });
      this.setState({groceryLists: [...this.state.groceryLists, res]});
    } catch (error) {
      this.setState({
        apiError: `Kunde inte skapa listan "${title}". Försök igen.`,
      });
    }
  };

  removeGroceryList = async (id, index) => {
    try {
      const deletedGroceryList = await deleteGroceryList(id);
      const groceryListsCopy = this.state.groceryLists.filter(
        groceryList => groceryList.id !== deletedGroceryList.id,
      );
      this.setState({groceryLists: groceryListsCopy});
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  render() {
    const {
      apiError,
      groceryLists,
      modalOpen,
      numberOfItems,
      settingsOpen,
    } = this.state;
    return (
      <View style={styles.container}>
        {modalOpen && (
          <AddGroceryListModal
            closeModal={() => this.toggleModal()}
            placeholder="Lägg till lista..."
            addGroceryList={this.addGroceryList}
          />
        )}
        {settingsOpen && (
          <SettingsModal closeModal={() => this.openSettings()} />
        )}
        <HomeScreenBackground openSettings={() => this.openSettings()} />
        {apiError.length > 0 && <Message message={apiError} />}
        <SafeAreaView style={{flex: 5, marginTop: '3%'}}>
          <GroceryListsContainer
            lists={groceryLists}
            removeGroceryList={this.removeGroceryList}
            goToGroceryList={groceryList =>
              this.props.navigation.navigate('List', {groceryList})
            }
            numberOfItems={numberOfItems}
          />
        </SafeAreaView>

        <IoniconsIcon
          size={80}
          style={styles.icon}
          color={'#06BA63'}
          name="ios-add-circle"
          onPress={() => this.toggleModal()}
        />
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3E3E3',
  },
  icon: {position: 'absolute', bottom: '10%', right: '15%', opacity: 0.8},
});
