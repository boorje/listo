import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Auth} from 'aws-amplify';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._isSignedIn();
  }

  _isSignedIn = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.props.navigation.navigate('Home', {user});
    } catch (e) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
