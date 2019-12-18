import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Auth} from 'aws-amplify';
import {useApolloClient, useMutation} from '@apollo/react-hooks';
//components
import SignupForm from '../../components/forms/signupForm';
import Message from '../../components/message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Logo from '../../components/logo';
//helpers
import validateEmail from '../../helpers/validateEmail';
//styles
import * as colors from '../../styles/colors';
//api
import * as mutations from '../../api/mutations';

// TODO: use crypto-browserify
function getRandomString(bytes) {
  return Math.random()
    .toString(bytes)
    .slice(-8);
}

export default function SignupScreen(props) {
  const [signupError, setError] = useState('');
  const [loading, toggleLoading] = useState(false);
  const client = useApolloClient();
  const [signup] = useMutation(mutations.SIGN_IN, {
    onError(err) {
      signupError('Could not register');
    },
  });

  function addUserToCache(id, email) {
    return new Promise(resolve => {
      client.writeData({
        data: {
          user: {
            __typename: 'User',
            id,
            email,
          },
        },
      });
      resolve();
    });
  }

  async function handleSubmit({email}) {
    toggleLoading(true);
    const params = {
      username: email,
      password: getRandomString(30),
    };
    try {
      await validateEmail(email);
      await Auth.signUp(params);
      const {attributes} = await Auth.signIn(params);
      await signup({
        variables: {input: {id: attributes.sub, email: attributes.email}},
      });
      await addUserToCache(attributes.sub, attributes.email);
      props.navigation.navigate('Authenticator');
    } catch (error) {
      toggleLoading(false);
      switch (error.code) {
        case 'ValidationError':
          setError(error.message);
          break;
        case 'UsernameExistsException':
          setError('The email is already used.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <View style={styles.container}>
      <Message
        messageOpen={signupError.length > 0}
        message={signupError}
        closeMessage={() => setError('')}
      />
      <Logo />
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerStyle={styles.scrollView}>
        <SignupForm
          handleSubmit={handleSubmit}
          loading={loading}
          goBack={() => props.navigation.navigate('Login')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
  },
});
