import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Auth} from 'aws-amplify';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../../styles/textStyles';

// -- Components --
import LoginForm from '../../components/forms/loginForm';
import PrimaryButton from '../../components/buttons/primaryButton';
import Message from '../../components/message';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';
import {addUserToDB} from '../../helpers/addUserToDB';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';

class LoginScreen extends React.Component {
  state = {
    signinError: '',
    loading: false,
  };

  handleLogin = async values => {
    const {email, password} = values;
    this.setState({loading: true});
    try {
      await validateValues(values);
      const user = await Auth.signIn({
        username: email,
        password,
      });
      // ! Remove this, add inside the homescreen instead. After successfully logged in, if getUser() is not found, then add it
      await addUserToDB(user.attributes);
      this.setState({loading: false});
      this.props.navigation.navigate('Home', {
        user,
      });
    } catch (error) {
      this.setState({loading: false});
      switch (error.code) {
        case 'ValidationError':
          this.setState({signinError: error.message});
          break;
        case 'UserNotFoundException':
          this.setState({signinError: 'The email does not exist.'});
          break;
        case 'NotAuthorizedException':
          this.setState({signinError: 'Incorrect email or password.'});
          break;
        default:
          this.setState({
            signinError: 'Could not login. Please try again.',
          });
      }
    }
  };

  render() {
    const {loading, signinError} = this.state;
    return (
      <View style={styles.container}>
        <Image
          style={styles.background}
          source={{
            uri: BACKGROUND_URL,
          }}
        />
        <View style={styles.form}>
          {signinError.length > 0 && <Message message={signinError} />}
          <View style={styles.logo}>
            <IoniconsIcon
              style={{marginRight: '3%'}}
              size={159}
              name={'ios-list'}
              color={'#06BA63'}
              onPress={() => {}}
            />
          </View>
          <LoginForm handleSubmit={this.handleLogin} loading={loading} />
          <Text
            onPress={() => this.props.navigation.navigate('ForgotPassword')}
            style={[textStyles.smallText, {color: 'white'}]}>
            Glömt lösenord?
          </Text>
          <View style={styles.divider} />
          <PrimaryButton
            title="Registrera dig"
            onPress={() => this.props.navigation.navigate('Signup')}
          />
        </View>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  background: {flex: 1, opacity: 0.67},
  logo: {alignItems: 'center'},
  form: {width: '70%', position: 'absolute', alignSelf: 'center'},
  divider: {marginBottom: 20, borderWidth: 1, borderColor: '#ddd'},
});
