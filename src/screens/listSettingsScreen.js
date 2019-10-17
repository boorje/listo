import React from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import * as yup from 'yup';
import Message from '../components/message';

import {createEditor, getEditors} from '../api/groceryListsAPI';
import {getUser, getUserIDByEmail} from '../api/authAPI';

// TODO: Add FORMIK Form ?
export default class ListSettingsScreen extends React.Component {
  state = {
    groceryList: {},
    editors: [],
    emailInput: '',
    apiError: '',
  };

  componentDidMount = async () => {
    try {
      const groceryList = await this.props.navigation.getParam(
        'groceryList',
        null,
      );
      this.setState({groceryList});
      const owner = await this.getOwnerEmail(groceryList.owner);
      let editors = await this.getEditors(groceryList.id);
      editors.unshift(owner);
      this.setState({editors});
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  getOwnerEmail = async id => {
    let owner = await getUser(id);
    owner.isOwner = true;
    return owner;
  };

  // get the current editors of the list
  getEditors = async listId => {
    try {
      return await getEditors(listId);
    } catch (error) {
      throw 'Could not fetch editors';
    }
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
      // check if logged in user is owner of list
      if (!this.state.groceryList.isOwner) {
        throw 'Only the admin has right to share the list';
      } else {
        // check for valid user input
        const enteredEmail = this.state.emailInput;
        await this.validateEmail(enteredEmail);

        // check if the email already exists in the list
        if (this.state.editors.length > 0) {
          this.state.editors.map(editor => {
            if (editor.email === enteredEmail) {
              throw 'User already has access to the list.';
            }
          });
        }

        const userID = await getUserIDByEmail(enteredEmail);
        // check if input email is the owner of the list
        if (this.state.groceryList.owner === userID) {
          throw 'You already have access to the list.';
        }
        // checks if the user already exists
        if (this.state.editors.length > 0) {
          this.state.editors.map(editor => {
            if (editor.id === userID) {
              throw 'User already has access to the list.';
            }
          });
        }
        const editor = await createEditor({
          editorListId: this.state.groceryList.id,
          editorUserId: userID,
        });
        this.setState(prevState => ({
          editors: [...prevState.editors, editor],
          emailInput: '',
        }));
      }
    } catch (error) {
      this.setState({apiError: error});
    }
  };

  // remove editor from the list
  removeEditor = async () => {};

  render() {
    const {apiError, editors, emailInput, groceryList} = this.state;
    return (
      <View>
        {apiError.length > 0 && <Message message={apiError} />}
        <Text>List members</Text>
        {editors.length > 0 &&
          editors.map(editor => (
            <Text key={editor.id}>
              {editor.email} {editor.isOwner ? '(owner)' : null}
            </Text>
          ))}
        {groceryList.isOwner && (
          <React.Fragment>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={text => this.setState({emailInput: text})}
              value={emailInput}
              autoCapitalize="none"
            />
            <Button title="share" onPress={() => this.addEditor()} />
          </React.Fragment>
        )}
      </View>
    );
  }
}
