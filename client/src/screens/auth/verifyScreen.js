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
import textStyles from '../../styles/textStyles';
// -- api --
import * as mutations from '../../api/mutations';

export default function VerifyScreen(props) {
  const [error, setError] = useState('');
  const [cognitoUser] = useState(
    props.navigation.getParam('cognitoUser', null),
  );
  const [loading, toggleLoading] = useState(false);
  const client = useApolloClient();

  const [signin] = useMutation(mutations.SIGN_IN, {
    onError(err) {
      setError('Could not login.');
    },
  });

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

  function addUserToCache(id, email) {
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
      await signin({variables: {input: {email: attributes.email}}});
      await addUserToCache(attributes.sub, attributes.email);
      toggleLoading(false);
      props.navigation.navigate('Home');
    } catch (err) {
      await Auth.signOut();
      toggleLoading(false);
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <Message
        messageOpen={error.length > 0}
        message={error}
        closeMessage={() => setError('')}
      />
      <Logo />
      <CodeForm
        handleSubmit={confirmSignin}
        loading={loading}
        submitTitle="Verify code"
      />
      {cognitoUser && cognitoUser.username && (
        <Text style={[textStyles.smallText, styles.textInfo]}>
          A code has been sent to{' '}
          <Text style={styles.email}>{cognitoUser.username}</Text>.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
  },
  textInfo: {
    textAlign: 'center',
    paddingVertical: '5%',
    color: 'white',
  },
  email: {
    fontWeight: 'bold',
  },
});
