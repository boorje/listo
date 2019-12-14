import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
// components
import GroceryListsContainer from '../components/groceryListsContainer';
import AddGroceryListModal from '../components/modals/AddGroceryListModal';
import Message from '../components/message';
import HomeScreenBackground from '../components/homeScreenBackground';
// api
import * as queries from '../api/queries';
import * as mutations from '../api/mutations';
// styles
import * as colors from '../styles/colors';

export default function HomeScreen(props) {
  const [modalOpen, toggleModal] = useState(false);
  const [messageOpen, toggleMessage] = useState(false);
  const [apiError, setApiError] = useState('');
  const {data: userData, loading: loadingUser, error: userError} = useQuery(
    queries.GET_USER,
  );

  if (userError || !userData) {
    // Navigate to auth screen if the user is not stored in cache
    props.navigation.navigate('Authenticator');
  }

  const [newList, {loading: creatingList}] = useMutation(
    mutations.CREATE_GROCERY_LIST,
    {
      update(cache, {data}) {
        const {getUserGroceryLists} = cache.readQuery({
          query: queries.GET_USERS_LISTS,
          variables: {owner: userData.user.id},
        });
        cache.writeQuery({
          query: queries.GET_USERS_LISTS,
          variables: {owner: userData.user.id},
          data: {
            getUserGroceryLists: [
              ...getUserGroceryLists,
              {...data.createGroceryList.list, items: null},
            ],
          },
        });
      },
      onError(error) {
        console.log(error);
        setApiError('API Error');
        toggleMessage(true);
      },
    },
  );

  if (loadingUser || creatingList) {
    // TODO: Add loading component
    console.log('Loading user or creatingList');
  }

  return (
    <View style={styles.container}>
      {modalOpen && (
        <AddGroceryListModal
          closeModal={() => toggleModal(modalOpen ? false : true)}
          placeholder="Add list..."
          addGroceryList={title => newList({variables: {input: {title}}})}
        />
      )}
      <HomeScreenBackground
        openSettings={() =>
          props.navigation.navigate('Settings', {user: userData.user})
        }
      />
      {apiError.length > 0 && messageOpen && (
        <Message
          messageOpen={() => toggleMessage(messageOpen ? false : true)}
          message={apiError}
        />
      )}
      <SafeAreaView style={{flex: 5, marginTop: '3%'}}>
        <GroceryListsContainer
          user={userData.user}
          goToList={() => props.navigation.navigate('List')}
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
