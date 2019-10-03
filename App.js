import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/homeScreen';
import ListScreen from './src/screens/listScreen';

Icon.loadFont();

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    List: {
      screen: ListScreen,
    },
  },
  {
    //mode: 'modal',
  },
);

const AppContainer = createAppContainer(MainStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
