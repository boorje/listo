import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';

// -- SCREENS --
import HomeScreen from './src/screens/homeScreen';
import ListScreen from './src/screens/listScreen';
import SettingsScreen from './src/screens/settingsScreen';
// -- AUTH --
import AuthScreen from './src/screens/auth/authScreen';
import LoginScreen from './src/screens/auth/loginScreen';
import SignupScreen from './src/screens/auth/signupScreen';
import VerifyScreen from './src/screens/auth/verifyScreen';
import SignedupScreen from './src/screens/auth/signupFinishedScreen';
import ForgotPasswordScreen from './src/screens/auth/forgotPasswordScreen';
import ResetPasswordScreen from './src/screens/auth/resetPasswordScreen';
import PasswordFinishedScreen from './src/screens/auth/passwordFinishedScreen';

Icon.loadFont();
IoniconsIcon.loadFont();

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    List: ListScreen,
    Settings: SettingsScreen,
  },
  {headerMode: 'none'},
);

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
    Verify: VerifyScreen,
    Signedup: SignedupScreen,
    ForgotPassword: ForgotPasswordScreen,
    ResetPassword: ResetPasswordScreen,
    PasswordFinished: PasswordFinishedScreen,
  },
  {headerMode: 'none'},
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
