import React, {useState} from 'react';
import {Text, TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {useQuery} from '@apollo/react-hooks';
//components
import OverlayModal from '../../components/modals/overlayModal';
import Message from '../../components/message';
import AddUser from '../../components/addUser.js';
import Swipeout from '../../components/swipeout';
//styles
import textStyles from '../../styles/textStyles';
//api
import * as queries from '../../api/queries';

export default function ListSettingsModal(props) {
  const [messageOpen, toggleMessage] = useState(false);
  const [scrollEnabled, toggleScroll] = useState(false);
  const [modalExpanded, toggleModalExpand] = useState(false);
  const [viewWidth, setViewWidth] = useState(0);
  const {data: userData, loading: loadingUser, error: userError} = useQuery(
    queries.GET_USER,
  );
  if (userError) props.navigation.navigate('Authenticator');
  const {
    data: editorsData,
    loading: loadingEditors,
    error: editorsError,
  } = useQuery(queries.GET_LIST_EDITORS, {
    variables: {listid: props.groceryList.id},
  });
  if (editorsError) console.log(editorsError);

  // validates the user input
  function validateEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const schema = yup.object().shape({
          email: yup
            .string()
            .email()
            .required(),
        });
        await schema.validate({email});
        resolve();
      } catch (error) {
        const {message} = error;
        reject(message.charAt(0).toUpperCase() + message.slice(1));
      }
    });
  }

  function renderEditor(editor) {
    return (
      <View
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setViewWidth(width);
        }}
        style={styles.item}>
        <Swipeout
          user={userData.user}
          disableScroll={() => toggleScroll(false)}
          enableScroll={() => toggleScroll(true)}
          swipeoutEnabled={props.groceryList.isOwner}
          viewWidth={viewWidth}
          delete={() => console.log('delete')}>
          <TouchableWithoutFeedback>
            <View style={styles.textAndIcon}>
              <Text style={[textStyles.default, {fontSize: 15}]}>
                {editor.email}
              </Text>
              {editor.id === props.groceryList.owner.id && (
                <Icon size={30} name={'ios-key'} color={'black'} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </Swipeout>
      </View>
    );
  }

  function addUserTextInput() {
    return (
      props.groceryList.isOwner && (
        <View style={styles.textInput}>
          <AddUser
            expandModal={() => toggleModalExpand(true)}
            addEditor={input => {
              // this.addEditor(input);
              toggleModalExpand(false);
            }}
          />
        </View>
      )
    );
  }

  return (
    <OverlayModal
      expandModal={modalExpanded}
      closeModal={props.closeModal}
      modalTitle="Listmedlemmar">
      {editorsError && messageOpen && (
        <Message
          messageOpen={() => toggleMessage(true)}
          message={editorsError}
        />
      )}
      {editorsData && editorsData.getListEditors && (
        <KeyboardAwareFlatList
          scrollEnabled={scrollEnabled}
          data={editorsData.getListEditors}
          renderItem={({item}) => renderEditor(item)}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={item => item.id}
          ListFooterComponent={addUserTextInput}
        />
      )}
    </OverlayModal>
  );
}

const styles = StyleSheet.create({
  item: {},
  textAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  textInput: {
    alignItems: 'center',
    marginTop: '10%',
  },
  separator: {
    height: 0.5,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: '#607D8B',
  },
});

ListSettingsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  groceryList: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    owner: PropTypes.shape({id: PropTypes.string.isRequired}).isRequired,
  }).isRequired,
};
