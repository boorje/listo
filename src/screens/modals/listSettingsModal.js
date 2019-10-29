import React from 'react';
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import * as yup from 'yup';
import PropTypes from 'prop-types';
// components
import OverlayModal from '../../components/modals/overlayModal';
import Message from '../../components/message';
// api
import {
  createEditor,
  deleteEditor,
  getEditors,
} from '../../api/groceryListsAPI';
import {getUserByEmail} from '../../api/authAPI';

/**
 * TODO:
 * Add Formik
 * Add Stylesheet
 */
export default class ListSettingsModal extends React.Component {
  state = {
    groceryList: this.props.groceryList || {},
    user: this.props.user || {},
    editors: [],
    emailInput: '',
    apiError: '',
    loggedInUserIsListOwner: false,
  };

  componentDidMount = async () => {
    try {
      await this.fetchEditors(this.state.groceryList.id);
      const loggedInUserIsListOwner =
        this.state.user.id === this.state.groceryList.owner;
      this.setState({loggedInUserIsListOwner});
    } catch (error) {
      this.setState({
        apiError: error ? error : 'Could not fetch editors. Please try again.',
      });
    }
  };

  fetchEditors = async listId => {
    try {
      const res = await getEditors(listId);
      if (!res || res === null) {
        throw 'Could not fetch editors. Please try again.';
      }
      let editors = [];
      res.editors.items.map(({user}) => {
        editors.push(user);
      });
      editors = await this.addOwnerProp(editors);
      this.setState({editors});
    } catch (error) {
      throw 'Could not fetch editors. Please try again.';
    }
  };

  addOwnerProp = async editors => {
    return await editors.map(editor => {
      if (editor.id === this.state.groceryList.owner) {
        editor.listOwner = true;
      }
      return editor;
    });
  };

  // validates the user input
  validateEmail = email => {
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
  };

  // add editor to the list
  addEditor = async () => {
    try {
      // TODO: check if logged in user is owner of list
      if (!this.state.loggedInUserIsListOwner) {
        throw 'Only the owner of the list can perform add users';
      } else {
        // check for valid user input
        // const enteredEmail = this.state.emailInput;
        const enteredEmail = 'adam@olivegren.se';
        await this.validateEmail(enteredEmail);

        // check if the email already exists in the list
        if (this.state.editors.length > 0) {
          this.state.editors.map(({email}) => {
            if (email === enteredEmail) {
              throw 'User already has access to the list.';
            }
          });
        }
        const res = await getUserByEmail(enteredEmail);
        if (!res || res === null) {
          throw 'User does not exist. Please try again.';
        } else if (res.items.length < 1) {
          throw 'User does not exist. Please try again.';
        }
        // checks if the user id already exists
        if (this.state.editors.length > 0) {
          this.state.editors.map(editor => {
            if (editor.id === res.id) {
              throw 'User already has access to the list.';
            }
          });
        }
        const editor = await createEditor({
          editorListId: this.state.groceryList.id,
          editorUserId: res.items[0].id,
        });
        this.setState(prevState => ({
          editors: [...prevState.editors, editor.user],
          emailInput: '',
        }));
      }
    } catch (error) {
      console.log(error);
      this.setState({apiError: error});
    }
  };

  // delete editor from the list
  // TODO: Add so only owner of the list can delete users
  // TODO: Validate that list owner is not deleted
  // TODO: What happens if i delete myself? -> has to be list owner to delete
  deleteEditor = async userId => {
    try {
      if (!this.state.loggedInUserIsListOwner) {
        throw 'Only the owner of the list can remove users.';
      }
      const {editors, groceryList} = this.state;
      const res = await deleteEditor({
        listId: groceryList.id,
        userId,
      });
      if (!res || res === null) {
        throw 'Could not remove user. Please try again.';
      }
      const newEditors = editors.filter(editor => editor.id !== userId);
      this.setState({editors: newEditors});
    } catch (error) {
      this.setState({apiError: error ? error : 'Could not remove the user.'});
    }
  };

  render() {
    const {apiError, editors, emailInput, loggedInUserIsListOwner} = this.state;

    return (
      <OverlayModal
        closeModal={this.props.closeModal}
        modalTitle="Inställningar"
        textInputActive={this.state.textInputActive}>
        <View>
          {apiError.length > 0 && <Message message={apiError} />}
          <Text>List members</Text>
          {editors.length > 0 && (
            <FlatList
              data={editors}
              renderItem={({item}) => (
                <TouchableHighlight
                  onPress={() => this.deleteEditor(item.id)}
                  style={{
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'blue',
                    padding: 20,
                  }}
                  disabled={item.listOwner || !loggedInUserIsListOwner}>
                  <Text>
                    {item.email} {item.listOwner ? '(owner)' : null}
                  </Text>
                </TouchableHighlight>
              )}
              keyExtractor={item => item.id}
            />
          )}
          {loggedInUserIsListOwner && (
            <React.Fragment>
              <TextInput
                style={{
                  margin: 20,
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                }}
                onChangeText={text => this.setState({emailInput: text})}
                value={emailInput}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="enter email of user to share with"
              />
              <Button title="share" onPress={() => this.addEditor()} />
            </React.Fragment>
          )}
        </View>
      </OverlayModal>
    );
  }
}

ListSettingsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  groceryList: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
};
