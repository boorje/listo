import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Auth} from 'aws-amplify';

// -- Components --
import ForgotPasswordForm from '../../components/forms/forgotPasswordForm';
import Message from '../../components/message';

class VerifyScreen extends React.Component {
  state = {
    sendEmailError: '',
    loading: false,
  };

  _validateEmail = email => {
    return new Promise((resolve, reject) => {
      if (email === null) {
        reject({
          code: 'ValidationError',
        });
      } else {
        resolve();
      }
    });
  };

  sendResetEmail = async ({email}) => {
    try {
      this.setState({loading: true});
      await this._validateEmail(email);
      await Auth.forgotPassword(email);
      this.setState({loading: false});
      this.props.navigation.navigate('ResetPassword', {email});
    } catch (error) {
      switch (error.code) {
        case 'ValidationError':
          this.setState({sendEmailError: 'Please provide a valid email.'});
          break;
        case 'UserNotFoundException':
          this.setState({sendEmailError: 'The email does not exist.'});
          break;

        default:
          this.setState({sendEmailError: 'Could not send email.'});
          break;
      }
      this.setState({loading: false});
    }
  };

  render() {
    const {loading, sendEmailError} = this.state;
    return (
      <View style={styles.container}>
        {sendEmailError.length > 0 && <Message message={sendEmailError} />}
        <ForgotPasswordForm
          handleSubmit={this.sendResetEmail}
          loading={loading}
        />
      </View>
    );
  }
}

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {margin: 30},
  textInfo: {
    textAlign: 'center',
  },
  email: {
    fontWeight: 'bold',
  },
});
