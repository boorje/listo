import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Auth} from 'aws-amplify';

// -- Components --
import SignupForm from '../../components/forms/signupForm';
import Message from '../../components/message';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';

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
    }
  };

  render() {
    const {loading, signupError} = this.state;
    return (
      <View style={styles.container}>
        {signupError.length > 0 && <Message message={signupError} />}
        <SignupForm handleSubmit={this.handleSubmit} loading={loading} />
      </View>
    );
  }
}

export default SignupScreen;

const styles = StyleSheet.create({
  container: {margin: 30},
});
