import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// -- Components --
import CodeForm from '../../components/forms/codeForm';
import Message from '../../components/message';
import Logo from '../../components/logo';

// -- helper --
import * as colors from '../../styles/colors';

class VerifyScreen extends React.Component {
  state = {
    verificationError: '',
    user: this.props.navigation.getParam('user', null),
    loading: false,
    cognitoUser: {},
    messageOpen: false,
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

  _signUserInAndAddToDB = async () => {
    try {
      const {email, password} = this.props.navigation.getParam('values', null);
    } catch (error) {
      this.props.navigation.navigate('Login');
    }
  };
  toggleMessage = () => {
    this.setState(prevstate => ({
      messageOpen: prevstate.messageOpen ? false : true,
    }));
  };

  render() {
    const {loading, verificationError, user, messageOpen} = this.state;
    return (
      <View style={styles.container}>
        {verificationError.length > 0 && messageOpen && (
          <Message
            messageOpen={() => this.toggleMessage()}
            message={verificationError}
          />
        )}
        <Logo />
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
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  textInfo: {
    textAlign: 'center',
  },
  email: {
    fontWeight: 'bold',
  },
});
