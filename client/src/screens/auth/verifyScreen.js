import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Auth} from 'aws-amplify';
import {useApolloClient, useMutation} from '@apollo/react-hooks';
//components
import CodeForm from '../../components/forms/codeForm';
import Message from '../../components/message';
import Logo from '../../components/logo';
//styles
import * as colors from '../../styles/colors';
// -- api --
import * as mutations from '../../api/mutations';

// // TODO: Mutation signin
// const res = await signin({variables: {email}});
// console.log(res);

export default function VerifyScreen(props) {
  const [error, setError] = useState('');
  const [cognitoUser] = useState(
    props.navigation.getParam('cognitoUser', null),
  );
  const [loading, toggleLoading] = useState(false);
  const [messageOpen, toggleMessage] = useState(false);
  const client = useApolloClient();

  const [signin, {loading: signinLoading, error: signError}] = useMutation(
    mutations.SIGN_IN,
  );

  function _validateCode(code) {
    return new Promise((resolve, reject) => {
      if (code === null) {
        reject({
          code: 'ValidationError',
        });
      } else {
        resolve();
      }
    });
  }

  function setTokenInHeader(id, email) {
    return new Promise(resolve => {
      client.writeData({
        data: {
          user: {
            __typename: 'User',
            id,
            email,
          },
        },
      });
      resolve();
    });
  }

  async function confirmSignin({code}) {
    try {
      toggleLoading(true);
      await _validateCode(code);
      await Auth.sendCustomChallengeAnswer(cognitoUser, code);
      await Auth.currentSession(); // checks if the user has entered the correct code
      const {attributes} = await Auth.currentAuthenticatedUser();
      await setTokenInHeader(attributes.sub, attributes.email);
      await signin({variables: {input: {email: attributes.email}}});
      props.navigation.navigate('Home');
    } catch (err) {
      await Auth.signOut();
      switch (err.code) {
        case 'ValidationError':
          setError('Please provide a valid verification code.');
          break;
        case 'CodeMismatchException':
          setError('The code is incorrect. Please try again.');
          break;
        default:
          setError('Code not verify the code. Please try again.');
          break;
      }
    }
    toggleLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      {error.length > 0 && messageOpen && (
        <Message
          messageOpen={() => toggleMessage(!messageOpen)}
          message={error}
        />
      )}
      {/* <Logo /> */}
      <CodeForm
        handleSubmit={confirmSignin}
        loading={loading}
        submitTitle="VERIFY CODE"
      />

      {cognitoUser && cognitoUser.username && (
        <Text style={styles.textInfo}>
          A code has been sent to{' '}
          <Text style={styles.email}>{cognitoUser.username}</Text>.
        </Text>
      )}
    </SafeAreaView>
  );
}

class VerifyScreen2 extends React.Component {
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
