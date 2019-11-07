import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {Auth} from 'aws-amplify';
import textStyles from '../../styles/textStyles';
import * as colors from '../../styles/colors';

// -- Components --
import SignupForm from '../../components/forms/signupForm';
import Message from '../../components/message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Logo from '../../components/logo';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';

class SignupScreen extends React.Component {
  state = {
    signupError: '',
    loading: false,
    messageOpen: false,
  };

  handleSubmit = async values => {
    const {email, password} = values;
    this.setState({loading: true});
    try {
      await validateValues(values);
      const {user} = await Auth.signUp({
        username: email,
        password,
      });
      this.setState({loading: false});
      this.props.navigation.navigate('Verify', {
        user,
        values,
      });
    } catch (error) {
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
