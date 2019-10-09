import React from 'react';
import {StyleSheet, View, LayoutAnimation, SafeAreaView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

// -- Components --
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';

// -- API helpers --
import {updateGroceryList} from '../api/groceryListsAPI';

import {getUserID} from '../api/authAPI';

// TODO: Create custom animation class

export default class ListScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: navigation.state.params.title,
      headerRight: (
        <IoniconsIcon
          size={32}
          name="md-settings"
          onPress={() => {
            navigation.navigate('Settings');
          }}
          style={{marginRight: 15}}
        />
      ),
    };
  };

  state = {
    apiError: '',
  };

  updateApiError = message => {
    this.setState({apiError: message});
  };

  //TODO: Dynamic update
  shareGroceryList = async () => {
    try {
      const userID = await getUserID('adam@olivegren.se');
      const res = await updateGroceryList({
        id: this.state.groceryListID,
        editors: [userID],
      });
      console.log(res);
    } catch (error) {
      console.log('ERROR --', error);
    }
  };

  render() {
    const {apiError, groceries} = this.state;
    return (
      <View style={styles.container}>
        {apiError.length > 0 && <Message message={apiError} />}

        <GroceriesContainer
          navigation={this.props.navigation}
          updateApiError={msg => this.updateApiError(msg)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
