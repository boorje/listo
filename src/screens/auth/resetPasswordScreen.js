import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Auth} from 'aws-amplify';
import textStyles from '../../styles/textStyles';

// -- Components --
import CodeForm from '../../components/forms/resetPasswordForm';
import Message from '../../components/message';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';

class ResetPasswordScreen extends React.Component {
  state = {
    resetPasswordError: '',
    loading: false,
  };

  _validateValues = ({email, code, new_password}) => {
    return new Promise((resolve, reject) => {
      if (email === null) {
        reject({
          code: 'ValidationError',
          message: 'Could not reset your password. Please try again.',
        });
      } else if (code === null || code.length < 6) {
        reject({
          code: 'ValidationError',
          message: 'Invalid verification code. Please try again.',
        });
      } else if (!new_password || new_password.length < 8) {
        reject({
          code: 'ValidationError',
          message: 'The password must be at least 8 characters.',
        });
      } else {
        resolve();
      }
    });
  };

  resetPassword = async values => {
    try {
      this.setState({loading: true});
      const {code, new_password} = values;
      const email = await this.props.navigation.getParam('email', null);
      await this._validateValues({email, code, new_password});
      await Auth.forgotPasswordSubmit(email, code, new_password);
      this.setState({loading: false});
      this.props.navigation.navigate('PasswordFinished');
    } catch (error) {
      this.setState({loading: false});
      switch (error.code) {
        case 'ValidationError':
          this.setState({resetPasswordError: error.message});
          break;
        case 'CodeMismatchException':
          this.setState({
            resetPasswordError: 'Invalid verification code. Please try again.',
          });
          break;
        default:
          this.setState({
            resetPasswordError:
              'Could not reset your password. Please try again.',
          });
          break;
      }
    }
  };

  render() {
    const {loading, resetPasswordError} = this.state;
    return (
      <View style={styles.container}>
        <Image
          style={styles.background}
          source={{
            uri: BACKGROUND_URL,
          }}
        />
        <View style={styles.form}>
          <Text style={textStyles.loginHeadline}>Fyll i informationen</Text>
          {resetPasswordError.length > 0 && (
            <Message message={resetPasswordError} />
          )}
          <CodeForm
            handleSubmit={this.resetPassword}
            loading={loading}
            submitTitle="CREATE PASSWORD"
          />
        </View>
      </View>
    );
  }
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
  background: {flex: 1, opacity: 0.67},
  form: {
    width: '70%',
    position: 'absolute',
    alignSelf: 'center',
  },
  textInfo: {
    textAlign: 'center',
  },
  email: {
    fontWeight: 'bold',
  },
});
