import React from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {Auth} from 'aws-amplify';

// -- Components --
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import AddGroceryListFooter from '../components/addGroceryListFooter';

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
        <SafeAreaView style={{flex: 8}}>
          <GroceryListsContainer
            lists={groceryLists}
            removeGroceryList={this.removeGroceryList}
            goToGroceryList={groceryList =>
              this.props.navigation.navigate('List', {groceryList})
            }
          />
        </SafeAreaView>
        <View style={styles.footer}>
          <AddGroceryListFooter addGroceryList={this.toggleModal} />
        </View>
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
  footer: {
    flex: 1,
    borderTopWidth: 0.5,
    paddingBottom: 0,
  },
});
