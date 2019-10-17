import React from 'react';
import {ActionSheetIOS, StyleSheet, View, SafeAreaView} from 'react-native';
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
  deleteGroceryList,
  deleteGroceryListAndEditors,
  deleteEditor,
  getEditorId,
} from '../api/groceryListsAPI';

import {getUserLists} from '../api/authAPI';

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'My Lists',
      headerRight: (
        <IoniconsIcon
          size={32}
          name="md-person"
          onPress={() =>
            navigation.navigate('Settings', {
              userEmail: navigation.state.params.userEmail,
            })
          }
          style={{marginRight: 15}}
        />
      ),
    };
  };

  state = {
    modalOpen: false,
    groceryLists: [],
    user: {},
    apiError: '',
  };

  componentDidMount = async () => {
    try {
      const user = await this.props.navigation.getParam('user', null);
      const groceryLists = await getUserLists(user.username);
      this.setState({
        groceryLists,
        user: {id: user.username, email: user.attributes.email},
      });
      this.props.navigation.setParams({userEmail: user.attributes.email});
    } catch (error) {
      console.log(error);
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
      res.isOwner = true;
      this.setState({groceryLists: [...this.state.groceryLists, res]});
    } catch (error) {
      this.setState({apiError: `Could not add ${title}. Please try again.`});
    }
  };

  // TODO: Remove the user and list from the editor model when deleting the list.
  removeGroceryList = async listID => {
    try {
      // check if user is owner of the list
      let isOwner = false;
      this.state.groceryLists.map(list => {
        if (list.id === listID) {
          if (list.isOwner) {
            isOwner = true;
          }
        }
      });
      if (isOwner) {
        // TODO: Needs to delete all editors from the list when the owner deletes the list
        // 1. Query for the id of editors where listID = listID
        // 2. Mutations on deleteGroceryListAndEditors with batch delete on editors
        // --
        // --
        // TODO: Query for the ids of the editors that have the listID
        const ids = ['85f19694-7b34-48fd-b0f8-46c2513dbe02'];
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: 'Do you want to remove the list?',
            options: ['Cancel', 'Remove'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 0,
          },
          async buttonIndex => {
            if (buttonIndex === 1) {
              const deletedGroceryList = await deleteGroceryListAndEditors(
                listID,
                ids,
              );
              const groceryListsCopy = this.state.groceryLists.filter(
                groceryList => groceryList.id !== deletedGroceryList.id,
              );
              this.setState({groceryLists: groceryListsCopy});
            }
          },
        );
      } else {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: 'Do you want to leave the list?',
            options: ['Cancel', 'Leave'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 0,
          },
          async buttonIndex => {
            if (buttonIndex === 1) {
              const userID = this.state.user.id;
              const editorID = await getEditorId(listID, userID);
              const {list} = await deleteEditor(editorID);
              const updatedList = this.state.groceryLists.filter(
                groceryList => groceryList.id !== list.id,
              );
              this.setState({groceryLists: updatedList});
            }
          },
        );
      }
    } catch (error) {
      console.log(error);
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
