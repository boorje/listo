import React from 'react';
import {ActionSheetIOS, StyleSheet, View, SafeAreaView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

// -- Components --
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import AddGroceryListFooter from '../components/addGroceryListFooter';

// -- API helpers --
import {
  createGroceryList,
  deleteGroceryList,
  deleteEditor,
} from '../api/groceryListsAPI';

import {getUser, createUser} from '../api/authAPI';

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
      await this.fetchUserLists();
    } catch (error) {
      this.setState({
        apiError: error ? error : 'Could not fetch lists. Please try again.',
      });
    }
  };

  fetchUserLists = async () => {
    try {
      const cognitoUser = await this.props.navigation.getParam('user', null);
      const user = await getUser(cognitoUser.username);
      if (!user || user === null) {
        // create the user in the database
        const {id, email} = await createUser(cognitoUser.attributes.email);
        this.setState({user: {id, email}});
      } else {
        const groceryLists = user.groceryLists.items;
        this.setState({
          groceryLists,
          user: {id: user.id, email: user.email},
        });
        // TODO: Set this if new user is created
        this.props.navigation.setParams({userEmail: user.email});
      }
    } catch (error) {
      if (error.errors) {
        if (error.errors[0].message === 'Network Error') {
          throw 'Network error. Please check your connection.';
        }
      }
      throw 'Could not fetch lists. Please try again.';
    }
  };

  addGroceryList = async title => {
    try {
      const res = await createGroceryList({title});
      res.isOwner = true;
      this.setState({groceryLists: [...this.state.groceryLists, res]});
    } catch (error) {
      this.setState({apiError: `Could not add ${title}. Please try again.`});
    }
  };

  removeGroceryList = async ({list}) => {
    try {
      const isOwner = this.isOwnerOfList(list.owner);
      const actionSheetTitle = `Do you want to ${
        isOwner ? 'delete' : 'leave'
      } this list?`;
      const actionSheetButton = isOwner ? 'Delete' : 'Leave';
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: actionSheetTitle,
          options: ['Cancel', actionSheetButton],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            let res;
            if (isOwner) {
              // TODO: Create a resolver which deletes all the editors of the list using the batch delete
              res = await deleteGroceryList(list.id);
            } else {
              res = await deleteEditor({
                listId: list.id,
                userId: this.state.user.id,
              });
            }
            if (!res || res === null) {
              throw isOwner
                ? 'Could not delete the list. Please try again.'
                : 'Could not leave the list. Please try again.';
            }
          }
        },
      );
      const groceryListsCopy = this.state.groceryLists.filter(
        groceryList => groceryList.id !== list.id,
      );
      this.setState({groceryLists: groceryListsCopy});
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  isOwnerOfList = listOwner => {
    return listOwner === this.state.user.id;
  };

  toggleModal = () => {
    this.setState(prevstate => ({
      modalOpen: prevstate.modalOpen ? false : true,
    }));
  };

  render() {
    const {apiError, groceryLists, modalOpen, user} = this.state;
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
              this.props.navigation.navigate('List', {groceryList, user})
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
