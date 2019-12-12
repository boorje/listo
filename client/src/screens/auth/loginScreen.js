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

const {height} = Dimensions.get('window');
const {Value} = Animated;

export default function LoginScreen(props) {
  const [backgroundY] = useState(new Value(0));
  const [loginFormOpacity] = useState(new Value(0));
  const [signinError, setError] = useState('');
  const [loading, toggleLoading] = useState(false);
  const [formOpen, toggleForm] = useState(false);
  const [messageOpen, toggleMessage] = useState(false);

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
      toggleMessage(true);
    }
    toggleLoading(false);
  }

  function toggleLogin() {
    toggleForm(!formOpen);
    const values = {
      backgroundY: {
        toValue: formOpen ? -height / 1.2 : 0,
        duration: 500,
      },
      loginFormOpacity: {
        toValue: formOpen ? 1 : 0,
        duration: 800,
      },
    };
    Animated.sequence([
      Animated.timing(backgroundY, {
        toValue: values.backgroundY.toValue,
        duration: values.backgroundY.duration,
      }),
      Animated.timing(loginFormOpacity, {
        toValue: values.loginFormOpacity.toValue,
        duration: values.loginFormOpacity.duration,
      }),
    ]).start();
  }

  return (
    <View style={styles.container}>
      {signinError.length > 0 && messageOpen && (
        <Message
          messageOpen={() => toggleMessage(!messageOpen)}
          message={signinError}
        />
      )}
      <Logo />
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <LoginForm
          //focus={this.state.textInputFocus} // ! doesn't exist
          handleSubmit={handleLogin}
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
});
