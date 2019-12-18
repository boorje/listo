import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, Animated} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Auth} from 'aws-amplify';
// -- components --
import LoginForm from '../../components/forms/loginForm';
import Message from '../../components/message';
import Logo from '../../components/logo';
// -- helpers --
import validateEmail from '../../helpers/validateEmail';
import * as colors from '../../styles/colors';

export default function LoginScreen(props) {
  const [signinError, setError] = useState('');
  const [loading, toggleLoading] = useState(false);

  async function handleLogin(values) {
    try {
      const {email} = values;
      toggleLoading(true);
      await validateEmail(email);
      const cognitoUser = await Auth.signIn(email);
      props.navigation.navigate('Verify', {cognitoUser});
    } catch (error) {
      switch (error.code) {
        case 'ValidationError':
          setError(error.message);
          break;
        case 'UserNotFoundException':
          setError('The email does not exist.');
          break;
        case 'NotAuthorizedException':
          setError('Incorrect email.');
          break;
        default:
          setError('Could not login. Please try again.');
      }
    }
    toggleLoading(false);
  }

  return (
    <View style={styles.container}>
      <Message
        messageOpen={signinError.length > 0}
        message={signinError}
        closeMessage={() => setError('')}
      />
      <Logo />
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerStyle={styles.scrollView}>
        <LoginForm
          handleLogin={handleLogin}
          loading={loading}
          register={() => props.navigation.navigate('Signup')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
  },
});
