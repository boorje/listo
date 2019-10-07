import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {Auth} from 'aws-amplify';

// -- Components --
import GroceryList from '../components/groceryList';
import AddGroceryListButton from '../components/buttons/addGroceryListButton';
import AddGroceryListModal from '../components/AddGroceryListModal';
import Message from '../components/message';

// -- API helpers --
import {createGroceryList, listGroceryLists} from '../api/groceryListsAPI';

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Mina listor',
      headerRight: (
        <IoniconsIcon
          size={32}
          name="md-settings"
          onPress={async () => {
            try {
              await Auth.signOut();
              navigation.navigate('Auth');
            } catch (error) {
              console.log(error);
            }
          }}
          style={{marginRight: 15}}
        />
      ),
    };
  };

  state = {
    modalOpen: false,
    groceryLists: [
      // {id: '1234', title: "Eric's lista", owner: '124-3829-432'},
      // {id: '5678', title: "Adam's lista", owner: '123423q-231'},
    ],
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
      const res = await createGroceryList({title});
      this.setState({groceryLists: [...this.state.groceryLists, res]});
    } catch (error) {
      this.setState({apiError: `Could not add ${title}. Please try again.`});
    }
  };

  removeGroceryList = index => {
    const tasksCopy = this.state.tasks;
    tasksCopy.splice(index, 1);
    this.setState({tasks: tasksCopy});
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
          <GroceryList
            lists={groceryLists}
            removeTask={index => this.removeGroceryList(index)}
            goToGroceryList={groceryList =>
              this.props.navigation.navigate('List', {groceryList})
            }
          />
          <AddGroceryListButton addGroceryList={() => this.toggleModal()} />
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
