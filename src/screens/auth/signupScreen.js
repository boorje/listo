import React from 'react';
import {View} from 'react-native';
import {Auth} from 'aws-amplify';
import {SignupForm} from '../../components/forms';
import Message from '../../components/message';

class SignupScreen extends React.Component {
  state = {
    signupError: 'The email is already used.',
  };

  handleSubmit = async values => {
    const {email, password} = values;
    try {
      const user = await Auth.signUp({
        username: email,
        password,
      });
      this.props.navigation.navigate('Verify', {
        user,
      });
    } catch (error) {
      switch (error.code) {
        case 'UsernameExistsException':
          this.setState({signupError: 'The email is already used.'});
          break;
        default:
          this.setState({
            signupError: 'Something went wrong. Please try again.',
          });
          break;
      }
      console.log(error);
      //this.setState({signupError: 'Could not create your account'});
    }
  };

  render() {
    const {signupError} = this.state;
    return (
      <View>
        {signupError.length > 0 && <Message message={signupError} />}
        <SignupForm handleSubmit={this.handleSubmit} />
      </View>
    );
  }
}

export default SignupScreen;
