import React from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';

// -- Components --
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import ListScreenHeader from '../components/listScreenHeader';

// -- API helpers --
import {updateGroceryList} from '../api/groceryListsAPI';
import {getUserID} from '../api/authAPI';

// TODO: Create custom animation class

export default class ListScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
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
        <ListScreenHeader
          goBack={() => this.props.navigation.goBack()}
          sharingOptions={() => this.props.navigation.navigate('Sharing')}
          navigation={this.props.navigation.state.params.title}
        />

        <View style={styles.separator} />
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
  separator: {
    height: 1,
    backgroundColor: '#808080',
    opacity: 0.5,
    marginBottom: '2%',
  },
});
