import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Auth} from 'aws-amplify';

// -- Components --
import LoginForm from '../../components/forms/loginForm';
import PrimaryButton from '../../components/buttons/primaryButton';
import Message from '../../components/message';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';

class LoginScreen extends React.Component {
  state = {
    signinError: '',
    loading: false,
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
      this.setState({loading: false});
      this.props.navigation.navigate('App', {
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

  render() {
    const {loading, signinError} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>SIMPSON</Text>
        </View>
        <View style={styles.form}>
          {signinError.length > 0 && <Message message={signinError} />}
          <LoginForm handleSubmit={this.handleLogin} loading={loading} />
          <Text
            onPress={() => this.props.navigation.navigate('ForgotPassword')}
            style={styles.forgotPsw}>
            Forgot password?
          </Text>
          <Text style={styles.divider}>Or</Text>
          <PrimaryButton
            title="SIGN UP"
            onPress={() => this.props.navigation.navigate('Signup')}
          />
        </View>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    margin: 50,
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 0,
  },
  logo: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logoText: {fontSize: 50, fontWeight: 'bold'},
  form: {flex: 2, justifyContent: 'flex-start'},
  forgotPsw: {textAlign: 'center'},
  divider: {textAlign: 'center', padding: 10},
});
