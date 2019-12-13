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
import ImageCropperScreen from './src/screens/imageCropper';
import CameraScreen from './src/screens/cameraScreen';
import ItemSelectionScreen from './src/screens/itemSelection';
import LoadingScreen from './src/screens/loadingScreen';

Icon.loadFont();
IoniconsIcon.loadFont();

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    List: ListScreen,
    Settings: SettingsScreen,
    Camera: CameraScreen,
    ImageCropper: ImageCropperScreen,
    ItemSelection: ItemSelectionScreen,
    Loading: LoadingScreen,
  },
  {headerMode: 'none'},
);

const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
    Verify: VerifyScreen,
  },
  {headerMode: 'none'},
);

export default createAppContainer(
  createSwitchNavigator(
    {
      Authenticator: AuthScreen,
      App: MainStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Authenticator',
    },
  ),
);
