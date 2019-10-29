import React from 'react';
import {StyleSheet, View, Text, Modal} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';

// -- Components --
import GroceriesContainer from '../components/groceriesContainer';
import Message from '../components/message';
import ScreenHeader from '../components/screenHeader';
import PreviousGroceriesModal from './modals/previousGroceriesModal';
import SharingModal from './modals/sharingModal';

// -- API helpers --
import {updateGroceryList} from '../api/groceryListsAPI';
import {getUserID} from '../api/authAPI';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';

export default class ListScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  state = {
    apiError: '',
    historyOpen: false,
    sharingOpen: false,
    previousGroceries: [],
  };

  openGroceryHistory = () => {
    this.setState({historyOpen: this.state.historyOpen ? false : true});
  };

  openSharingSettings = () => {
    this.setState({sharingOpen: this.state.sharingOpen ? false : true});
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
    const {apiError, groceries, historyOpen, sharingOpen} = this.state;
    return (
      <View style={styles.container}>
        {historyOpen && (
          <PreviousGroceriesModal
            closeModal={() => this.openGroceryHistory()}
          />
        )}
        {sharingOpen && (
          <SharingModal closeModal={() => this.openSharingSettings()} />
        )}
        {apiError.length > 0 && <Message message={apiError} />}
        <ScreenHeader
          leftIconPress={() => this.props.navigation.goBack()}
          rightIcon1Press={() => this.openGroceryHistory()}
          rightIcon2Press={() => this.openSharingSettings()}
          headerTitle={this.props.navigation.state.params.title}
          leftIcon={'ios-arrow-round-back'}
          rightIcon1={'md-hourglass'}
          rightIcon2={'md-person-add'}
          background={BACKGROUND_URL}
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
