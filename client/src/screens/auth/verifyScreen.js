import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Auth} from 'aws-amplify';
//components
import CodeForm from '../../components/forms/codeForm';
import Message from '../../components/message';
import Logo from '../../components/logo';
//styles
import * as colors from '../../styles/colors';

class VerifyScreen extends React.Component {
  state = {
    verificationError: '',
    cognitoUser: this.props.navigation.getParam('cognitoUser', null),
    loading: false,
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

  confirmSignin = async ({code}) => {
    try {
      this.setState({loading: true});
      await this._validateCode(code);
      const cognitoUser = await Auth.sendCustomChallengeAnswer(
        this.state.cognitoUser,
        code,
      );
      await Auth.currentSession(); // checks if the user has entered the correct code
      // Todo: findorcreate(user) in DB in BE before moving forward
      this.props.navigation.navigate('Authenticator');
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

  toggleMessage = () => {
    this.setState(prevstate => ({
      messageOpen: prevstate.messageOpen ? false : true,
    }));
  };

  render() {
    const {loading, verificationError, user, messageOpen} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {verificationError.length > 0 && messageOpen && (
          <Message
            messageOpen={() => this.toggleMessage()}
            message={verificationError}
          />
        )}
        {/* <Logo /> */}
        <CodeForm
          handleSubmit={this.confirmSignin}
          loading={loading}
          submitTitle="VERIFY CODE"
        />

        {user && user.username && (
          <Text style={styles.textInfo}>
            A verification code has been sent to{' '}
            <Text style={styles.email}>{user.username}</Text>.
          </Text>
        )}
      </SafeAreaView>
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
