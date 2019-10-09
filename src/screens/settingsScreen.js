import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Auth} from 'aws-amplify';

import PrimaryButton from '../components/buttons/primaryButton';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Settings',
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
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>Delas med: </Text>
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
