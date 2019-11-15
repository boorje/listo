import React from 'react';
import {
  ActionSheetIOS,
  SafeAreaView,
  StyleSheet,
  Text,
  LayoutAnimation,
  View,
} from 'react-native';

// components
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import HomeScreenBackground from '../components/homeScreenBackground';
import Icon from 'react-native-vector-icons/MaterialIcons';
import animations from '../styles/animations';
import * as colors from '../styles/colors';

// api
import {
  createGroceryList,
  deleteGroceryListAndEditors,
  deleteEditor,
} from '../api/groceryListsAPI';
import {getUser, createUser} from '../api/authAPI';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.screenWidth = null;
    this.ref = React.createRef();
  }
  state = {
    modalOpen: false,
    groceryLists: [],
    user: {},
    apiError: '',
    viewWidth: 0,
    messageOpen: false,
  };

  componentDidMount = async () => {
    try {
      await this.fetchUserLists();
    } catch (error) {
      this.setState({
        apiError: error ? error : 'Could not fetch lists. Please try again.',
      });
      this.setState({messageOpen: true});
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
      const res = await createGroceryList(title);
      res.isOwner = true;
      this.setState({groceryLists: [...this.state.groceryLists, {list: res}]});
    } catch (error) {
      this.setState({
        apiError: `Kunde inte skapa listan "${title}". Försök igen.`,
      });
      this.setState({messageOpen: true});
    }
  };

  deleteGroceryList = async listId => {
    try {
      return await deleteGroceryListAndEditors(listId);
    } catch (error) {
      this.setState({apiError: 'Could not delete the list.'});
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
              res = await this.deleteGroceryList(list.id);
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
            const groceryListsCopy = this.state.groceryLists.filter(
              groceryList => groceryList.list.id !== list.id,
            );
            LayoutAnimation.configureNext(animations.default);
            this.setState({groceryLists: groceryListsCopy});
          }
        },
      );
    } catch (error) {
      console.log(error);
      this.setState({apiError: error});
      this.setState({messageOpen: true});
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
  toggleMessage = () => {
    this.setState(prevstate => ({
      messageOpen: prevstate.messageOpen ? false : true,
    }));
  };

  render() {
    const {apiError, groceryLists, modalOpen, user, messageOpen} = this.state;
    return (
      <View style={styles.container}>
        {modalOpen && (
          <AddGroceryListModal
            closeModal={() => this.toggleModal()}
            placeholder="Add list..."
            addGroceryList={this.addGroceryList}
          />
        )}
        <HomeScreenBackground
          openSettings={() =>
            this.props.navigation.navigate('Settings', {user})
          }
        />
        {apiError.length > 0 && messageOpen && (
          <Message
            messageOpen={() => this.toggleMessage()}
            message={apiError}
          />
        )}
        <SafeAreaView style={{flex: 5, marginTop: '3%'}}>
          <GroceryListsContainer
            user={user}
            groceryLists={groceryLists}
            removeGroceryList={this.removeGroceryList}
            onRefresh={() => this.fetchUserLists()}
            goToGroceryList={groceryList =>
              this.props.navigation.navigate('List', {groceryList, user})
            }
          />
        </SafeAreaView>
        <View style={styles.addIcon}>
          <Icon
            size={80}
            name={'add'}
            color={'white'}
            onPress={() => this.toggleModal()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  addIcon: {
    position: 'absolute',
    borderRadius: 50,
    bottom: '10%',
    right: '15%',
    backgroundColor: colors.primaryColor,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 0.7,
  },
});
