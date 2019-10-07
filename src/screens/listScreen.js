import React from 'react';
import {StyleSheet, View, ScrollView, LayoutAnimation} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import AddGrocery from '../components/addGrocery';
import ItemContainer from '../components/itemContainer';
import Message from '../components/message';

// -- API helpers --
import {getGroceryList, createGroceryItem} from '../api/groceryListsAPI';

// TODO: Create custom animation class

class ListScreen extends React.Component {
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
    apiError: '',
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

  showDetails = (grocery, index) => {
    let groceriesCopy = [...this.state.groceries];
    if (grocery.details) {
      groceriesCopy[index].details = false;
    } else {
      groceriesCopy[index].details = true;
    }
    LayoutAnimation.spring();
    this.setState({
      groceries: groceriesCopy,
    });
  };

  render() {
    const {apiError, groceries} = this.state;
    return (
      <View style={styles.container}>
        {apiError.length > 0 && <Message message={apiError} />}
        <ScrollView keyboardShouldPersistTaps="always">
          <ItemContainer
            items={groceries}
            updateItem={() => console.log('update')}
            removeItem={() => console.log('remove')}
            showDetails={(item, index) => this.showDetails(item, index)}
          />
          <AddGrocery addGrocery={this.addGrocery} />
        </ScrollView>
      </View>
    );
  }
}
export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
});
