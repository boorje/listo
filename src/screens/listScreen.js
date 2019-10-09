import React from 'react';
import {StyleSheet, View, LayoutAnimation} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

// -- Components --
import AddGroceryFooter from '../components/addGroceryFooter';
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import PrimaryButton from '../components/buttons/primaryButton';

import animations from '../styles/animations';

// -- API helpers --
import {
  getGroceryList,
  updateGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from '../api/groceryListsAPI';

import {getUserID} from '../api/authAPI';

// TODO: Create custom animation class

export default class ListScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: navigation.state.params.title,
      headerRight: (
        <IoniconsIcon
          size={32}
          name="md-settings"
          onPress={() => {
            navigation.navigate('Settings');
          }}
          style={{marginRight: 15}}
        />
      ),
    };
  };

  state = {
    groceries: [],
    groceryListID: '',
    apiError: '',
    adjustFooter: false,
    addItemOpen: false,
  };

  componentDidMount = async () => {
    try {
      const groceryList = await this.props.navigation.getParam(
        'groceryList',
        null,
      );
      this.setState({groceryListID: groceryList.id});
      this.props.navigation.setParams({title: groceryList.title});
      const groceries = await getGroceryList(groceryList.id);
      if (groceries) {
        groceries.details = false;
        this.setState({groceries});
      }
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  addGrocery = async grocery => {
    try {
      const newGroceryID = await createGroceryItem(
        grocery,
        this.state.groceryListID,
      );
      const {content, quantity, unit} = grocery;
      LayoutAnimation.spring();
      this.setState({
        groceries: [
          ...this.state.groceries,
          {
            content,
            quantity,
            unit,
            details: false,
            id: newGroceryID,
          },
        ],
      });
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  removeGrocery = async id => {
    try {
      const deleteGrocery = await deleteGroceryItem(id);
      const stateCopy = this.state.groceries.filter(
        grocery => grocery.id !== deleteGrocery.id,
      );
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  updateGrocery = async updatedGrocery => {
    try {
      const res = await updateGroceryItem(updatedGrocery);
      const stateCopy = this.state.groceries.map(grocery => {
        if (grocery.id === res.id) {
          grocery.content = updatedGrocery.content;
          grocery.quantity = updatedGrocery.quantity;
          grocery.unit = updatedGrocery.unit;
        }
        return grocery;
      });
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  //TODO: Dynamic update
  shareGroceryList = async () => {
    try {
      const userID = await getUserID('adam@olivegren.se');
      const res = await updateGroceryList({
        id: this.state.groceryListID,
        editors: [userID],
      });
      console.log(res);
    } catch (error) {
      console.log('ERROR --', error);
    }
  };

  showGroceryForm = (grocery, index) => {
    if (this.state.addItemOpen) {
      this.setState({adjustFooter: false, addItemOpen: false});
    }
    let groceriesCopy = [...this.state.groceries];
    if (grocery.details) {
      groceriesCopy[index].details = false;
    } else {
      groceriesCopy[index].details = true;
    }
    LayoutAnimation.configureNext(animations.default);
    this.setState({
      groceries: groceriesCopy,
    });
  };

  showAddGrocery = () => {
    if (this.state.addItemOpen === false) {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: true});
    } else {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: false});
    }
    this.adjustFooter();
  };

  adjustFooter = () => {
    LayoutAnimation.configureNext(animations.default);
    this.setState({adjustFooter: !this.state.adjustFooter ? true : false});
  };

  render() {
    const {apiError, groceries} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.scrollView}>
          {apiError.length > 0 && <Message message={apiError} />}
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            viewIsInsideTabBar={true}
            automaticallyAdjustContentInsets={false}>
            <GroceriesContainer
              items={groceries}
              updateGrocery={this.updateGrocery}
              removeGrocery={this.removeGrocery}
              showGroceryForm={this.showGroceryForm}
            />
            <PrimaryButton
              title="Dela med Adam"
              onPress={this.shareGroceryList}
            />
          </KeyboardAwareScrollView>
        </View>
        <View
          style={{
            justifyContent: !this.state.adjustFooter ? 'center' : 'flex-start',
            flex: !this.state.adjustFooter ? 1 : 10,
            paddingTop: !this.state.adjustFooter ? 0 : 20,
            borderTopWidth: 0.5,
            paddingBottom: 0,
          }}>
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
  },
  scrollView: {
    flex: 8,
  },
  footer: {
    justifyContent: 'center',
    flex: 1,
    borderTopWidth: 0.5,
    paddingBottom: 0,
  },
});
