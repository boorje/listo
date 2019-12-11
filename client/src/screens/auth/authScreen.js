import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Auth} from 'aws-amplify';
import {useApolloClient} from '@apollo/react-hooks';

export default function AuthenticatorScreen(props) {
  const client = useApolloClient();

  useEffect(() => {
    async function validateUserToken() {
      try {
        await Auth.currentSession();
        const {attributes} = await Auth.currentAuthenticatedUser();
        client.writeData({
          data: {
            user: {
              __typename: 'User',
              id: attributes.sub,
              email: attributes.email,
            },
          },
        });
        props.navigation.navigate('Home');
      } catch (e) {
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
