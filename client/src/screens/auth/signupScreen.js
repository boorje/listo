import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Auth} from 'aws-amplify';

import * as colors from '../../styles/colors';

// -- Components --
import SignupForm from '../../components/forms/signupForm';
import Message from '../../components/message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Logo from '../../components/logo';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';

// TODO: use crypto-browserify
function getRandomString(bytes) {
  return Math.random()
    .toString(bytes)
    .slice(-8);
}

class SignupScreen extends React.Component {
  state = {
    signupError: '',
    loading: false,
    messageOpen: false,
  };

  handleSubmit = async values => {
    this.setState({loading: true});
    const params = {
      username: 'ericborjesson123@gmail.com',
      password: getRandomString(30),
    };
    try {
      //await validateValues(values);
      const res = await Auth.signUp(params);
      // TODO: userSub should be added to db.
      await Auth.signIn(params);
      //this.props.navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
      switch (error.code) {
        case 'ValidationError':
          this.setState({signupError: error.message});
          break;
        case 'UsernameExistsException':
          this.setState({signupError: 'The email is already used.'});
          break;
        default:
          this.setState({
            signupError: 'Something went wrong. Please try again.',
          });
      }
      this.setState({messageOpen: true});
    }
  };
  toggleMessage = () => {
    this.setState(prevstate => ({
      messageOpen: prevstate.messageOpen ? false : true,
    }));
  };
  render() {
    const {loading, signupError, messageOpen} = this.state;
    return (
      <View style={styles.container}>
        {signupError.length > 0 && messageOpen && (
          <Message
            messageOpen={() => this.toggleMessage()}
            message={signupError}
          />
        )}
        <Logo />
        <KeyboardAwareScrollView
          scrollEnabled={false}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <SignupForm
            handleSubmit={this.handleSubmit}
            loading={loading}
            goBack={() => this.props.navigation.navigate('Login')}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
  },
});
