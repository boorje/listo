import React from 'react';
import {View} from 'react-native';
import {Auth} from 'aws-amplify';
import * as yup from 'yup';
import {SignupForm} from '../../components/forms';
import Message from '../../components/message';

class SignupScreen extends React.Component {
  state = {
    signupError: '',
    loading: false,
  };

  //! REMOVE
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _validateValues = async values => {
    return new Promise(async (resolve, reject) => {
      try {
        const schema = yup.object().shape({
          email: yup
            .string()
            .email()
            .required(),
          password: yup
            .string()
            .min(8)
            .required(),
        });
        await schema.validate(values);
        resolve();
      } catch (error) {
        const {message, name} = error;
        reject({
          code: name,
          message: message.charAt(0).toUpperCase() + message.slice(1),
        });
      }
    });
  };

  handleSubmit = async values => {
    const {email, password} = values;
    this.setState({loading: true});
    await this.sleep(2000);
    try {
      await this._validateValues(values);
      const user = await Auth.signUp({
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
      <View>
        {signupError.length > 0 && <Message message={signupError} />}
        <SignupForm handleSubmit={this.handleSubmit} loading={loading} />
      </View>
    );
  }
}

export default SignupScreen;
