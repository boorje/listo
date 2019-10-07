import React from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  LayoutAnimation,
  KeyboardAvoidingView,
} from 'react-native';

import AddItem from '../components/addItem';
import ItemContainer from '../components/itemContainer';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import animations from '../styles/animations';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import * as shortid from 'shortid';

// TODO: Create custom animation class

class ListScreen extends React.Component {
  state = {
    items: [
      {content: 'Cola', quantity: '2', unit: 'st'},
      {content: 'Bärs', quantity: '3', unit: 'flak'},
      {content: 'kiwi', quantity: '3', unit: 'st'},
      {content: 'mjölk', quantity: '1', unit: 'l'},
      {content: 'Cola', quantity: '2', unit: 'st'},
      {content: 'Bärs', quantity: '3', unit: 'flak'},
      {content: 'kiwi', quantity: '3', unit: 'st'},
      {content: 'mjölk', quantity: '1', unit: 'l'},
      {content: 'Cola', quantity: '2', unit: 'st'},
      {content: 'Bärs', quantity: '3', unit: 'flak'},
      {content: 'kiwi', quantity: '3', unit: 'st'},
      {content: 'mjölk', quantity: '1', unit: 'l'},
      {content: 'kiwi', quantity: '3', unit: 'st'},
      {content: 'mjölk', quantity: '1', unit: 'l'},
      {content: 'Cola', quantity: '2', unit: 'st'},
      {content: 'Bärs', quantity: '3', unit: 'flak'},
      {content: 'kiwi', quantity: '3', unit: 'st'},
      {content: 'mjölk', quantity: '1', unit: 'l'},
      {content: 'Cola', quantity: '2', unit: 'st'},
      {content: 'Bärs', quantity: '3', unit: 'flak'},
      {content: 'kiwi', quantity: '3', unit: 'st'},
      {content: 'mjölk', quantity: '1', unit: 'l'},
    ],
    adjustFooter: false,
    addItemOpen: false,
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

  adjustFooter = () => {
    LayoutAnimation.configureNext(animations.default);
    this.setState({adjustFooter: !this.state.adjustFooter ? true : false});
  };

  addItem = async item => {
    const {content, quantity, unit} = item;
    LayoutAnimation.configureNext(animations.default);
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
      LayoutAnimation.configureNext(animations.default);
      this.setState({items: newItems});
    } catch (error) {
      console.log(error);
    }
  };

  removeItem = index => {
    const itemsCopy = this.state.items;
    itemsCopy.splice(index, 1);
    LayoutAnimation.configureNext(animations.default);
    this.setState({items: itemsCopy});
  };

  showItemDetails = (item, index) => {
    //Close addItem if press on already existing item
    if (this.state.addItemOpen) {
      this.setState({adjustFooter: false, addItemOpen: false});
    }
    let itemsCopy = JSON.parse(JSON.stringify(this.state.items));
    if (item.details) {
      itemsCopy[index].details = false;
    } else {
      itemsCopy[index].details = true;
    }
    LayoutAnimation.configureNext(animations.default);
    this.setState({
      items: itemsCopy,
    });
  };

  showAddItem = () => {
    if (this.state.addItemOpen === false) {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: true});
    } else {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: false});
    }
    this.adjustFooter();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scrollView}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            viewIsInsideTabBar={true}
            automaticallyAdjustContentInsets={false}>
            <ItemContainer
              items={this.state.items}
              updateItem={(item, index) => this.updateItem(item, index)}
              removeItem={index => this.removeItem(index)}
              showDetails={(item, index) => this.showItemDetails(item, index)}
            />
          </KeyboardAwareScrollView>
        </View>
        <View
          style={{
            justifyContent: !this.state.adjustFooter ? 'center' : 'flex-start',
            flex: !this.state.adjustFooter ? 1 : 9,
            paddingTop: !this.state.adjustFooter ? 0 : 20,
            borderTopWidth: 0.5,
            paddingBottom: 0,
          }}>
          <AddItem
            addItem={item => this.addItem(item)}
            addItemOpen={this.state.addItemOpen}
            showAddItem={() => this.showAddItem()}
          />
        </View>
      </View>
    );
  }
}
export default ListScreen;

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
