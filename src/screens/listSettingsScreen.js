import React from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {
  createGroceryListEditor,
  getGroceryListEditors,
} from '../api/groceryListsAPI';

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
      // TODO: Change so the value comes from the form
      const enteredEmail = this.state.emailInput;
      console.log(enteredEmail);
      // Get the id of the user

      // const userId = '1c8f66ad-04ac-4fad-9588-8db5a044e2e8';
      // let isEditor = false;
      // // checks if the user already exists
      // this.state.editors.map(({editor}) => {
      //   if (editor.id === userId) {
      //     isEditor = true;
      //   }
      // });
      // if (isEditor) {
      //   throw 'user is already an editor';
      // } else {
      //   const {id} = this.state.groceryList;
      //   const editor = await createGroceryListEditor({
      //     groceryListEditorGroceryListId: id,
      //     groceryListEditorEditorId: userId,
      //   });
      //   this.setState(prevState => ({
      //     editors: [...prevState.editors, editor],
      //   }));
      // }
    } catch (error) {
      alert(error);
    }
  };

  // remove editor from the list
  removeEditor = async () => {};

  render() {
    const {editors, emailInput} = this.state;
    return (
      <View>
        <Text>Delas med:</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={emailInput => this.setState({emailInput})}
          value={emailInput}
        />
        <Button title="share" onPress={() => this.addEditor()} />
        {editors.length > 0 &&
          editors.map(({editor}) => <Text>{editor.email}</Text>)}
      </View>
    );
  }
}
