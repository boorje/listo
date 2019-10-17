import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Auth} from 'aws-amplify';

import PrimaryButton from '../components/buttons/primaryButton';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Settings',
  };

  state = {
    userEmail: '',
  };

  componentDidMount = async () => {
    try {
      const userEmail = await this.props.navigation.getParam('userEmail', '');
      this.setState({userEmail});
    } catch (error) {
      alert(error);
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
    const {userEmail} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          {userEmail.length > 0 && <Text>Signed in as: {userEmail}</Text>}
          <PrimaryButton title="LOGOUT" onPress={() => this._logout()} />
        </ScrollView>
      </View>
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
});
