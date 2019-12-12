import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useQuery, useMutation} from '@apollo/react-hooks';
// components
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import ScreenHeader from '../components/screenHeader';
import PreviousGroceriesModal from './modals/previousGroceriesModal';
import ListSettingsModal from './modals/listSettingsModal';
import AddGroceryFooter from '../components/addGroceryFooter';
//api
import * as queries from '../api/queries';
import * as mutations from '../api/mutations';
import * as colors from '../styles/colors';

export default function ListScreen(props) {
  const [list, setList] = useState({});
  const [user] = useState({});
  const [historyOpen, toggleHistory] = useState(false);
  const [listSettingsOpen, toggleSettings] = useState(false);
  const [messageOpen, toggleMessage] = useState(false);
  const [apiError, setApiError] = useState('');
  const [addItemOpen, toggleAddItem] = useState(false);

  const [addGroceryItem] = useMutation(mutations.CREATE_GROCERY_LIST_ITEM, {
    update(cache, {data}) {
      const {getGroceryListItems} = cache.readQuery({
        query: queries.GET_GROCERY_LIST_ITEMS,
        variables: {list: list.id},
      });
      cache.writeQuery({
        query: queries.GET_GROCERY_LIST_ITEMS,
        variables: {list: list.id},
        data: {
          getGroceryListItems: [
            ...getGroceryListItems,
            {...data.createGroceryItem.item},
          ],
        },
      });
    },
    onError(error) {
      setApiError('Haha');
    },
  });

  useEffect(() => {
    setList(props.navigation.getParam('list', {}));
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      {historyOpen && (
        <PreviousGroceriesModal closeModal={() => toggleHistory(false)} />
      )}
      {listSettingsOpen && (
        <ListSettingsModal
          groceryList={list}
          user={user}
          closeModal={() => toggleSettings(false)}
        />
      )}
      {apiError.length > 0 && messageOpen && (
        <Message messageOpen={() => toggleMessage(true)} message={apiError} />
      )}
      <ScreenHeader
        leftIconPress={props.navigation.goBack}
        rightIcon1Press={() => toggleHistory(true)}
        rightIcon2Press={() => toggleSettings(true)}
        headerTitle={list.title}
        leftIcon={'ios-arrow-round-back'}
        //rightIcon1={'md-hourglass'}
        rightIcon2={'md-person-add'}
      />
      <View style={{flex: 11}}>
        <GroceriesContainer
          navigation={props.navigation}
          addItemOpen={addItemOpen}
          listId={list.id}
        />
      </View>
      <View style={styles.footer}>
        <AddGroceryFooter
          addGrocery={input => {
            const item = {...input, list: list.id};
            addGroceryItem({variables: {input: item}});
          }}
          addItemOpen={addItemOpen}
          navigation={props.navigation}
          showAddGrocery={() => toggleAddItem(!addItemOpen)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryColor,
  },
  footer: {
    bottom: 0,
    flex: 2,
    justifyContent: 'center',
  },
});
