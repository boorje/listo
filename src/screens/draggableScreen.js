import React from 'react';
import {LayoutAnimation, StyleSheet, View, Modal} from 'react-native';
// components
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import ScreenHeader from '../components/screenHeader';
import PreviousGroceriesModal from './modals/previousGroceriesModal';
import ListSettingsModal from './modals/listSettingsModal';
import animations from '../styles/animations';
import * as colors from '../styles/colors';
import AddGroceryFooter from '../components/addGroceryFooter';
import DraggableTest from './draggableTest';

// api
import {
  getGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from '../api/groceryListsAPI';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';

export default class ListScreen extends React.Component {
  state = {
    groceryList: {},
    //groceries: [],
    groceries: [
      //! MOCK DATA
      {id: 0, content: '0', quantity: 3, unit: 'flak'},
      {id: 1, content: '1', quantity: 3, unit: 'flak'},
      {id: 2, content: '2', quantity: 3, unit: 'flak'},
      {id: 3, content: '3', quantity: 3, unit: 'flak'},
      {id: 4, content: '4', quantity: 3, unit: 'flak'},
      {id: 5, content: '5', quantity: 3, unit: 'flak'},
      {id: 6, content: '6', quantity: 3, unit: 'flak'},
      {id: 7, content: '7', quantity: 3, unit: 'flak'},
      {id: 8, content: '8', quantity: 3, unit: 'flak'},
      {id: 9, content: '9', quantity: 3, unit: 'flak'},
    ],
    user: {},
    apiError: '',
    listSettingsOpen: false,
    historyOpen: false,
    previousGroceries: [],
    addItemOpen: false,
    messageOpen: false,
    listOffset: 0,
  };

  render() {
    return (
      <View
        style={styles.container}
        onLayout={e => {
          this.setState({listOffset: e.nativeEvent.layout.y});
        }}>
        <DraggableTest parentOffset={this.state.listOffset}></DraggableTest>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, top: 250},
});
