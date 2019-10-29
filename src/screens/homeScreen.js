import React from 'react';
import {
  ActionSheetIOS,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
// components
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import HomeScreenBackground from '../components/homeScreenBackground';
import Swipeout from '../components/swipeout';
// api
import {
  createGroceryList,
  deleteGroceryList,
  deleteEditor,
} from '../api/groceryListsAPI';
import {getUser, createUser} from '../api/authAPI';

export default class HomeScreen extends React.Component {
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
      if (!cognitoUser) {
        this.props.navigation.navigate('login');
      }
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
      console.log(error);
      if (error.errors) {
        if (error.errors[0].message === 'Network Error') {
          throw 'Network error. Please check your connection.';
        }
      }
      throw 'Could not fetch lists. Please try again.';
    }
  };

  // TODO: Create a resolver which adds the user as a editor
  addGroceryList = async title => {
    try {
      const res = await createGroceryList({title});
      res.isOwner = true;
      this.setState({groceryLists: [...this.state.groceryLists, {list: res}]});
    } catch (error) {
      this.setState({
        apiError: `Kunde inte skapa listan "${title}". Försök igen.`,
      });
    }
  };

  // TODO: Create a resolver which batch deletes editors
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
            }
            res = await deleteEditor({
              listId: list.id,
              userId: this.state.user.id,
            });
            if (!res || res === null) {
              throw isOwner
                ? 'Could not delete the list. Please try again.'
                : 'Could not leave the list. Please try again.';
            }
            const groceryListsCopy = this.state.groceryLists.filter(
              groceryList => groceryList.list.id !== list.id,
            );
            this.setState({groceryLists: groceryListsCopy});
          }
        },
      );
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
        {modalOpen && (
          <AddGroceryListModal
            closeModal={() => this.toggleModal()}
            placeholder="Lägg till lista..."
            addGroceryList={this.addGroceryList}
          />
        )}
        <HomeScreenBackground
          openSettings={() =>
            this.props.navigation.navigate('Settings', {user})
          }
        />
        {apiError.length > 0 && <Message message={apiError} />}
        <SafeAreaView style={{flex: 5, marginTop: '3%'}}>
          <GroceryListsContainer
            groceryLists={groceryLists}
            removeGroceryList={this.removeGroceryList}
            goToGroceryList={groceryList =>
              this.props.navigation.navigate('List', {groceryList, user})
            }
          />
        </SafeAreaView>

        <Swipeout></Swipeout>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3E3E3',
  },
  icon: {position: 'absolute', bottom: '10%', right: '15%', opacity: 0.8},
});
