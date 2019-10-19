import React from 'react';
import {Auth} from 'aws-amplify';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._isSignedIn();
  }

  _isSignedIn = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      this.props.navigation.navigate('Auth');
    } catch (e) {
      this.props.navigation.navigate('Auth');
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
