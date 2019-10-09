import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

// -- Components --
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListButton from '../components/buttons/addGroceryListButton';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';

// -- API helpers --
import {
  createGroceryList,
  listGroceryLists,
  deleteGroceryList,
} from '../api/groceryListsAPI';

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'My Lists',
      headerRight: (
        <IoniconsIcon
          size={32}
          name="md-settings"
          onPress={() => navigation.navigate('Settings')}
          style={{marginRight: 15}}
        />
      ),
    };
  };

  state = {
    modalOpen: false,
    groceryLists: [],
    apiError: '',
  };

  componentDidMount = async () => {
    try {
      const groceryLists = await listGroceryLists();
      this.setState({groceryLists});
    } catch (error) {
      this.setState({apiError: 'Could not fetch lists. Please try again.'});
    }
  };

  toggleModal = () => {
    this.setState(prevstate => ({
      modalOpen: prevstate.modalOpen ? false : true,
    }));
  };

  addGroceryList = async title => {
    try {
      const res = await createGroceryList({
        title,
      });
      this.setState({groceryLists: [...this.state.groceryLists, res]});
    } catch (error) {
      this.setState({apiError: `Could not add ${title}. Please try again.`});
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
    const {apiError, groceryLists, modalOpen} = this.state;
    return (
      <View style={styles.container}>
        {apiError.length > 0 && <Message message={apiError} />}
        {modalOpen && (
          <AddGroceryListModal
            closeModal={() => this.toggleModal()}
            placeholder="Lägg till lista..."
            addGroceryList={this.addGroceryList}
          />
        )}
        <ScrollView>
          <GroceryListsContainer
            lists={groceryLists}
            removeGroceryList={this.removeGroceryList}
            goToGroceryList={groceryList =>
              this.props.navigation.navigate('List', {groceryList})
            }
          />
          <AddGroceryListButton addGroceryList={this.toggleModal} />
        </ScrollView>
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
});
