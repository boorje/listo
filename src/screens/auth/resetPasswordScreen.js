import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Auth} from 'aws-amplify';
import textStyles from '../../styles/textStyles';

// -- Components --
import ResetPasswordForm from '../../components/forms/resetPasswordForm';
import Message from '../../components/message';
import * as colors from '../../styles/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
        {resetPasswordError.length > 0 && (
          <Message message={resetPasswordError} />
        )}
        <KeyboardAwareScrollView
          scrollEnabled={false}
          contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
          <ResetPasswordForm
            handleSubmit={this.resetPassword}
            loading={loading}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
  },
});
