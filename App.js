import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Amplify from 'aws-amplify';
import Icon from 'react-native-vector-icons/MaterialIcons';

// -- SCREENS --
import HomeScreen from './src/screens/homeScreen';
import ListScreen from './src/screens/listScreen';
import SettingsScreen from './src/screens/settingsScreen';

import AuthScreen from './src/screens/auth/authScreen';
import StartScreen from './src/screens/auth/startScreen';
import SignupScreen from './src/screens/auth/signupScreen';
import LoginScreen from './src/screens/auth/loginScreen';
import VerifyScreen from './src/screens/auth/verifyScreen';

// -- AMPLIFY SETUP --
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

Icon.loadFont();

const MainStack = createStackNavigator({
  Home: HomeScreen,
  List: ListScreen,
  Settings: SettingsScreen,
});

const AuthStack = createStackNavigator(
  {
    Start: StartScreen,
    Signup: SignupScreen,
    Login: LoginScreen,
    Verify: VerifyScreen,
  },
  //{headerMode: 'none'},
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthScreen,
      App: MainStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
