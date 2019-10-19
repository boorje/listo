import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {Auth} from 'aws-amplify';
import textStyles from '../../styles/textStyles';

// -- Components --
import SignupForm from '../../components/forms/signupForm';
import Message from '../../components/message';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';

class SignupScreen extends React.Component {
  state = {
    signupError: '',
    loading: false,
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
    }
  };

  render() {
    const {loading, signupError} = this.state;
    return (
      <View style={styles.container}>
        <Image
          style={styles.background}
          source={{
            uri: BACKGROUND_URL,
          }}
        />
        <View style={styles.form}>
          <Text style={textStyles.loginHeadline}>Fyll i formuläret</Text>
          {signupError.length > 0 && <Message message={signupError} />}
          <SignupForm handleSubmit={this.handleSubmit} loading={loading} />
        </View>
      </View>
    );
  }
}

export default SignupScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
  background: {flex: 1, opacity: 0.67},
  form: {width: '70%', position: 'absolute', alignSelf: 'center'},
});
