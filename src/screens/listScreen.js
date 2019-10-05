import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  LayoutAnimation,
} from 'react-native';

import AddItem from '../components/addItem';
import ItemContainer from '../components/itemContainer';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import * as shortid from 'shortid';

// TODO: Create custom animation class

class ListScreen extends React.Component {
  state = {
    items: [],
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Adam',
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
  addItem = async item => {
    const {content, quantity, unit} = item;
    LayoutAnimation.spring();
    await this.setState({
      items: [
        ...this.state.items,
        {content, quantity, unit, details: false, id: shortid.generate()},
      ],
    });
  };

  updateItem = (updatedItem, updatedItemIndex) => {
    try {
      const copy = [...this.state.items];
      const newItems = copy.map((item, index) => {
        if (index === updatedItemIndex) {
          item.content = updatedItem.content;
          item.quantity = updatedItem.quantity;
          item.unit = updatedItem.unit;
        }
        return item;
      });
      LayoutAnimation.spring();
      this.setState({items: newItems});
    } catch (error) {
      console.log(error);
    }
  };

  removeItem = index => {
    const itemsCopy = this.state.items;
    itemsCopy.splice(index, 1);
    LayoutAnimation.spring();
    this.setState({items: itemsCopy});
  };

  showDetails = (item, index) => {
    let itemsCopy = JSON.parse(JSON.stringify(this.state.items));
    if (item.details) {
      itemsCopy[index].details = false;
    } else {
      itemsCopy[index].details = true;
    }
    LayoutAnimation.spring();
    this.setState({
      items: itemsCopy,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always">
          <ItemContainer
            items={this.state.items}
            updateItem={(item, index) => this.updateItem(item, index)}
            removeItem={index => this.removeItem(index)}
            showDetails={(item, index) => this.showDetails(item, index)}
          />
          <AddItem addItem={item => this.addItem(item)} />
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
