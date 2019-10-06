import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Auth} from 'aws-amplify';

// -- Components --
import CodeForm from '../../components/forms/codeForm';
import Message from '../../components/message';

class VerifyScreen extends React.Component {
  state = {
    verificationError: '',
    user: this.props.navigation.getParam('user', null),
    loading: false,
  };

  _validateCode = code => {
    return new Promise((resolve, reject) => {
      if (code === null) {
        reject({
          code: 'ValidationError',
        });
      } else {
        resolve();
      }
    });
  };

  confirmSignup = async ({code}) => {
    try {
      this.setState({loading: true});
      await this._validateCode(code);
      await Auth.confirmSignUp(this.state.user.username, code);
      this.props.navigation.navigate('Signedup');
      this.setState({loading: false});
    } catch (error) {
      this.setState({loading: false});
      switch (error.code) {
        case 'ValidationError':
          this.setState({
            sendEmailError: 'Please provide a valid verification code.',
          });
          break;
        case 'CodeMismatchException':
          this.setState({
            verificationError: 'The code is incorrect. Please try again.',
          });
          break;
        default:
          this.setState({
            verificationError: 'Code not verify the code. Please try again.',
          });
          break;
      }
    }
  };

  render() {
    const {loading, verificationError, user} = this.state;
    return (
      <View style={styles.container}>
        {verificationError.length > 0 && (
          <Message message={verificationError} />
        )}
        <CodeForm
          handleSubmit={this.confirmSignup}
          loading={loading}
          submitTitle="VERIFY CODE"
        />
        {user.username && (
          <Text style={styles.textInfo}>
            A verification code has been sent to{' '}
            <Text style={styles.email}>{user.username}</Text>.
          </Text>
        )}
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
