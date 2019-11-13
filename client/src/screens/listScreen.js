import React, {useEffect, useState} from 'react';
import {LayoutAnimation, StyleSheet, View, Modal} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';

// components
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import ScreenHeader from '../components/screenHeader';
import PreviousGroceriesModal from './modals/previousGroceriesModal';
import ListSettingsModal from './modals/listSettingsModal';
import animations from '../styles/animations';
import * as colors from '../styles/colors';
import AddGroceryFooter from '../components/addGroceryFooter';

export default function ListScreen(props) {
  const [list, setList] = useState({});
  const [user] = useState({});
  const [historyOpen, toggleHistory] = useState(false);
  const [listSettingsOpen, toggleSettings] = useState(false);
  const [messageOpen, toggleMessage] = useState(false);
  const [apiError] = useState('');
  const [addItemOpen, toggleAddItem] = useState(false);

  useEffect(() => {
    setList(props.navigation.getParam('list', {}));
  }, [props.navigation]);

  function addGrocery() {}

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
          addGrocery={() => addGrocery}
          addItemOpen={addItemOpen}
          showAddGrocery={() => toggleAddItem(true)}
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
