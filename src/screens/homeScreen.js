import React from 'react';
import {StyleSheet, View, Image, SafeAreaView, Text} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';

// -- Components --
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import AddGroceryListFooter from '../components/addGroceryListFooter';
import Background from '../components/background';

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
    groceryLists: [],
    apiError: '',
    numberOfItems: 8,
  };

  componentDidMount = async () => {
    try {
      const groceryLists = await listGroceryLists();
      const groceries = groceryLists.map(
        list => getGroceryList(list.id).length,
      );
      console.log(groceries);
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
    const {apiError, groceryLists, modalOpen, numberOfItems} = this.state;
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
        <Background
          navigate={() => this.props.navigation.navigate('Settings')}
        />
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

        <AddGroceryListFooter addGroceryList={this.toggleModal} />
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
});
