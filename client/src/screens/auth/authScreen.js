import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Auth} from 'aws-amplify';

export default function AuthLoadingScreen(props) {
  useEffect(() => {
    async function validateUserToken() {
      try {
        await Auth.currentSession();
        props.navigation.navigate('Home');
      } catch (e) {
        console.log('Authscreen::::, ', e);
        props.navigation.navigate('Login');
      }
    }
    validateUserToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
