import React from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {
  createGroceryListEditor,
  getGroceryListEditors,
} from '../api/groceryListsAPI';

import {getUserIDByEmail} from '../api/authAPI';

export default class ListSettingsScreen extends React.Component {
  state = {
    groceryList: {},
    editors: [],
    emailInput: '',
  };

  componentDidMount = async () => {
    try {
      const groceryList = await this.props.navigation.getParam(
        'groceryList',
        null,
      );
      const editors = await this.getEditors(groceryList.id);
      this.setState({groceryList, editors});
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // get the current editors of the list
  getEditors = async listId => {
    try {
      return await getGroceryListEditors(listId);
    } catch (error) {
      throw 'Could not fetch editors';
    }
  };

  // add editor to the list
  addEditor = async () => {
    try {
      if (!this.state.groceryList.isOwner) {
        throw 'Only the admin has right to share the list';
      } else {
        // check if logged in user is owner of list
        const enteredEmail = this.state.emailInput;
        const userID = await getUserIDByEmail(enteredEmail);
        // checks if the user already exists
        this.state.editors.map(({editor}) => {
          if (editor.id === userID) {
            throw 'User already has access to the list.';
          }
        });
        const editor = await createGroceryListEditor({
          groceryListEditorGroceryListId: this.state.groceryList.id,
          groceryListEditorEditorId: userID,
        });
        this.setState(prevState => ({
          editors: [...prevState.editors, editor],
          emailInput: '',
        }));
      }
    } catch (error) {
      alert(error);
    }
  };

  // remove editor from the list
  removeEditor = async () => {};

  render() {
    const {editors, emailInput, groceryList} = this.state;
    return (
      <View>
        <Text>Delas med:</Text>
        {groceryList.isOwner && (
          <React.Fragment>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={emailInput => this.setState({emailInput})}
              value={emailInput}
              autoCapitalize="none"
            />
            <Button title="share" onPress={() => this.addEditor()} />
          </React.Fragment>
        )}
        {editors.length > 0 &&
          editors.map(({editor}) => (
            <Text key={editor.id}>{editor.email}</Text>
          ))}
      </View>
    );
  }
}
