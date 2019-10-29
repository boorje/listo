/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, Dimensions, Animated} from 'react-native';
import {Auth} from 'aws-amplify';
import textStyles from '../../styles/textStyles';
import Svg, {Image, ClipPath, Circle} from 'react-native-svg';

// -- Components --
import LoginForm from '../../components/forms/loginForm';
import PrimaryButton from '../../components/buttons/primaryButton';
import Message from '../../components/message';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

// -- Helpers --
import validateValues from '../../helpers/validateFormValues';
import {addUserToDB} from '../../helpers/addUserToDB';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');
const {Value} = Animated;

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.backgroundY = new Value(0);
    this.loginFormOpacity = new Value(0);
  }
  state = {
    signinError: '',
    loading: false,
    formOpen: false,
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

  openLogin = () => {
    this.setState({formOpen: true});
    Animated.sequence([
      Animated.timing(this.backgroundY, {
        toValue: -height / 1.2,
        duration: 500,
      }),
      Animated.timing(this.loginFormOpacity, {
        toValue: 1,
        duration: 800,
      }),
    ]).start();
  };
  closeLogin = () => {
    this.setState({formOpen: false});
    Animated.sequence([
      Animated.timing(this.loginFormOpacity, {
        toValue: 0,
        duration: 100,
      }),
      Animated.timing(this.backgroundY, {
        toValue: 0,
        duration: 400,
      }),
    ]).start();
  };

  render() {
    const {loading, signinError} = this.state;
    return (
      <View style={styles.container}>
        {signinError.length > 0 && <Message message={signinError} />}

        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{translateY: this.backgroundY}],
          }}>
          <Svg height={height * 1.1} width={width}>
            <ClipPath id="clip">
              <Circle r={height * 1.1} cx={width / 2} />
            </ClipPath>
            <Image
              width={width}
              height={height * 1.1}
              clipPath="url(#clip)"
              preserveAspectRatio="xMidYMid slice"
              href={require('../../assets/groceries2.jpg')}
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttons,
            {
              opacity: this.backgroundY.interpolate({
                inputRange: [-width / 2, 0],
                outputRange: [0, 1],
              }),
            },
          ]}>
          <PrimaryButton title="Logga in" onPress={() => this.openLogin()} />
          <PrimaryButton
            title="Registrera dig"
            onPress={() => this.props.navigation.navigate('Signup')}
          />
        </Animated.View>

        <Animated.View
          style={{
            zIndex: this.backgroundY.interpolate({
              inputRange: [-width / 2, 0],
              outputRange: [1, -1],
            }),
            opacity: this.loginFormOpacity,
            height: height / 1.4,
            ...StyleSheet.absoluteFill,
            top: null,
            alignItems: 'center',
          }}>
          <Animated.View style={styles.closeButton}>
            <TouchableOpacity
              style={styles.closeButtonTouch}
              onPress={() => this.closeLogin()}>
              <Animated.Text
                style={{
                  fontSize: 15,
                  transform: [
                    {
                      rotate: this.loginFormOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}>
                X
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          {this.state.formOpen && (
            <View style={{width: '70%'}}>
              <LoginForm
                focus={this.state.textInputFocus}
                handleSubmit={this.handleLogin}
                loading={loading}
              />
            </View>
          )}
        </Animated.View>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeButton: {
    borderRadius: 50,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: -40,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 0.4,
  },
  closeButtonTouch: {
    borderRadius: 50,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    height: height / 4,
    width: '70%',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    marginBottom: '10%',
  },
  divider: {marginBottom: 20, borderWidth: 1, borderColor: '#ddd'},
});

{
  /* <Text
            onPress={() => this.props.navigation.navigate('ForgotPassword')}
            style={[textStyles.smallText, {color: 'white'}]}>
            Glömt lösenord?
          </Text>
          <View style={styles.divider} /> */
}
