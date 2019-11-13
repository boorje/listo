import React, {useState, useEffect} from 'react';
import {
  ActionSheetIOS,
  SafeAreaView,
  StyleSheet,
  LayoutAnimation,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// components
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import HomeScreenBackground from '../components/homeScreenBackground';
import * as colors from '../styles/colors';

export default function HomeScreen(props) {
  const [user, setUser] = useState({
    id: '9cd866c9-02cc-4d93-aef6-28dfc28392a3',
    email: 'eric.borjesson@hotmail.com',
  });
  const [modalOpen, toggleModal] = useState(false);
  const [messageOpen, toggleMessage] = useState(false);
  const [apiError, setApiError] = useState('');

  function addGroceryList() {}

  return (
    <View style={styles.container}>
      {modalOpen && (
        <AddGroceryListModal
          closeModal={() => toggleModal(modalOpen ? false : true)}
          placeholder="Add list..."
          addGroceryList={this.addGroceryList}
        />
      )}
      <HomeScreenBackground
        openSettings={() => props.navigation.navigate('Settings', {user})}
      />
      {apiError.length > 0 && messageOpen && (
        <Message
          messageOpen={() => toggleMessage(messageOpen ? false : true)}
          message={apiError}
        />
      )}
      <SafeAreaView style={{flex: 5, marginTop: '3%'}}>
        <GroceryListsContainer
          user={user}
          goToGroceryList={groceryList =>
            props.navigation.navigate('List', {list: groceryList})
          }
        />
      </SafeAreaView>
      <View style={styles.addIcon}>
        <Icon
          size={80}
          name={'add'}
          color={'white'}
          onPress={() => toggleModal(modalOpen ? false : true)}
        />
      </View>
    </View>
  );
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
