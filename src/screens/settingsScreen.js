import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import {Auth} from 'aws-amplify';

import PrimaryButton from '../components/buttons/primaryButton';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Settings',
  };

  state = {
    user: {},
  };

  componentDidMount = async () => {
    try {
      const user = await this.props.navigation.getParam('user', null);
      this.setState({user});
    } catch (error) {
      console.log(error);
    }
  };

  _logout = async () => {
    try {
      await Auth.signOut();
      this.props.navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {user} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {Object.entries(user).length > 0 && user.constructor === Object && (
            <Text>Signed in as: {user.email}</Text>
          )}
          <PrimaryButton title="LOGOUT" onPress={() => this._logout()} />
          <TouchableHighlight
            onPress={() => this.props.navigation.goBack()}
            style={styles.goBackButton}>
            <Text>Go back</Text>
          </TouchableHighlight>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
  goBackButton: {
    padding: 20,
    margin: 50,
    borderColor: '#ddd',
    borderWidth: 2,
  },
});
