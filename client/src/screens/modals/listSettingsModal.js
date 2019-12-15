import React, {useState} from 'react';
import {Text, TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {useMutation, useQuery} from '@apollo/react-hooks';
//components
import OverlayModal from '../../components/modals/overlayModal';
import Message from '../../components/message';
import AddUser from '../../components/addUser.js';
import Swipeout from '../../components/swipeout';
//styles
import textStyles from '../../styles/textStyles';
//api
import * as queries from '../../api/queries';
import * as mutations from '../../api/mutations';

export default function ListSettingsModal(props) {
  const [messageOpen, toggleMessage] = useState(false);
  const [scrollEnabled, toggleScroll] = useState(false);
  const [modalExpanded, toggleModalExpand] = useState(false);
  const [viewWidth, setViewWidth] = useState(0);
  const [apiError, setApiError] = useState('');
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

  const [
    addListEditor,
    {loading: mutationLoading, error: mutationError},
  ] = useMutation(mutations.CREATE_LIST_EDITOR, {
    update(cache, {data}) {
      const {getListEditors} = cache.readQuery({
        query: queries.GET_LIST_EDITORS,
        variables: {listid: props.groceryList.id},
      });
      cache.writeQuery({
        query: queries.GET_LIST_EDITORS,
        variables: {listid: props.groceryList.id},
        data: {
          getListEditors: [...getListEditors, data.createListEditor.editor],
        },
      });
    },
    onError(error) {
      setApiError('Could not add the user.');
      toggleMessage(true);
    },
  });

  const [deleteListEditor] = useMutation(mutations.DELETE_LIST_EDITOR, {
    update(cache, {data}) {
      const {getListEditors} = cache.readQuery({
        query: queries.GET_LIST_EDITORS,
        variables: {listid: props.groceryList.id},
      });
      cache.writeQuery({
        query: queries.GET_LIST_EDITORS,
        variables: {listid: props.groceryList.id},
        data: {
          getListEditors: getListEditors.filter(
            user => user.id !== data.deleteListEditor.editor.id,
          ),
        },
      });
    },
    onError(error) {
      setApiError('Could not delete the user.');
      toggleMessage(true);
    },
  });

  if (loadingEditors) console.log('loading'); // TODO: add fetching loader
  if (mutationLoading) console.log('loading'); // TODO: add mutation loader
  if (editorsError) console.log(editorsError); // TODO: setApiError
  // if (mutationError) console.log(); // TODO: setApiError

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
        setApiError(message.charAt(0).toUpperCase() + message.slice(1));
      }
    });
  }

  async function addEditor(email) {
    try {
      await validateEmail(email);
      await addListEditor({
        variables: {input: {email, listid: props.groceryList.id}},
      });
    } catch (error) {
      setApiError('Could not add the editor.');
    }
  }

  async function deleteEditor(userid) {
    try {
      if (!props.groceryList.isOwner || userid === props.groceryList.owner.id) {
        throw 'Could not delete the owner';
      }
      await deleteListEditor({
        variables: {input: {listid: props.groceryList.id, userid}},
      });
    } catch (error) {
      setApiError('Could not delete the editor.');
    }
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
          swipeoutEnabled={
            props.groceryList.isOwner && // only the owner can delete an editor
            editor.id !== props.groceryList.owner.id // the owner can't be deleted
          }
          viewWidth={viewWidth}
          delete={() => deleteEditor(editor.id)}>
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
            addEditor={email => {
              addEditor(email);
              toggleModalExpand(false);
            }}
          />
        </View>
      )
    );
  }

  console.log(props);

  return (
    <OverlayModal
      expandModal={modalExpanded}
      closeModal={props.closeModal}
      modalTitle="Listmedlemmar">
      {apiError.length > 0 && messageOpen && (
        <Message messageOpen={() => toggleMessage(false)} message={apiError} />
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
  textAndIcon: {
    position: 'absolute',
    bottom: '-50%',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
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
