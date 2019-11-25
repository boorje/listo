import React from 'react';
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

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.backgroundY = new Value(0);
    this.loginFormOpacity = new Value(0);
  }
  state = {
    signinError: '',
    loading: false,
    formOpen: false,
    openMessage: false,
  };

  handleLogin = async values => {
    const {email} = values;
    this.setState({loading: true});
    try {
      await validateEmail(email);
      const cognitoUser = await Auth.signIn(email);
      this.props.navigation.navigate('Verify', {cognitoUser});
    } catch (error) {
      this.setState({loading: false});
      switch (error.code) {
        case 'ValidationError':
          this.setState({signinError: error.message});
          break;
        case 'UserNotFoundException':
          this.setState({signinError: 'The email does not exist.'});
          break;
        case 'NotAuthorizedException':
          this.setState({signinError: 'Incorrect email.'});
          break;
        default:
          this.setState({
            signinError: 'Could not login. Please try again.',
          });
      }
      this.setState({messageOpen: true});
    }
  };

  openLogin = () => {
    this.setState({formOpen: true});
    Animated.sequence([
      Animated.timing(this.backgroundY, {
        toValue: -height / 1.2,
        duration: 500,
      }),
      Animated.timing(this.loginFormOpacity, {
        toValue: 1,
        duration: 800,
      }),
    ]).start();
  };

  closeLogin = () => {
    this.setState({formOpen: false});
    Animated.sequence([
      Animated.timing(this.loginFormOpacity, {
        toValue: 0,
        duration: 100,
      }),
      Animated.timing(this.backgroundY, {
        toValue: 0,
        duration: 400,
      }),
    ]).start();
  };

  toggleMessage = () => {
    this.setState(prevstate => ({
      messageOpen: prevstate.messageOpen ? false : true,
    }));
  };

  render() {
    const {loading, signinError, messageOpen} = this.state;
    return (
      <View style={styles.container}>
        {signinError.length > 0 && messageOpen && (
          <Message
            messageOpen={() => this.toggleMessage()}
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
            focus={this.state.textInputFocus}
            handleSubmit={this.handleLogin}
            loading={loading}
            register={() => this.props.navigation.navigate('Signup')}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
});
