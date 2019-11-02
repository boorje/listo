/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, Dimensions, Animated} from 'react-native';
import {Auth} from 'aws-amplify';

// -- Components --
import LoginForm from '../../components/forms/loginForm';
import PrimaryButton from '../../components/buttons/primaryButton';
import Message from '../../components/message';
import * as colors from '../../styles/colors';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';
import {addUserToDB} from '../../helpers/addUserToDB';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');
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
  };

  handleLogin = async values => {
    const {email, password} = values;
    this.setState({loading: true});
    try {
      await validateValues(values);
      const user = await Auth.signIn({
        username: email,
        password,
      });
      // ! Remove this, add inside the homescreen instead. After successfully logged in, if getUser() is not found, then add it
      await addUserToDB(user.attributes);
      this.setState({loading: false});
      this.props.navigation.navigate('Home', {
        user,
      });
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
          this.setState({signinError: 'Incorrect email or password.'});
          break;
        default:
          this.setState({
            signinError: 'Could not login. Please try again.',
          });
      }
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

  render() {
    const {loading, signinError} = this.state;
    return (
      <View style={styles.container}>
        {signinError.length > 0 && <Message message={signinError} />}

        <LoginForm
          focus={this.state.textInputFocus}
          handleSubmit={this.handleLogin}
          loading={loading}
          forgotPassword={() =>
            this.props.navigation.navigate('ForgotPassword')
          }
          register={() => this.props.navigation.navigate('Signup')}
        />
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
  },
});
