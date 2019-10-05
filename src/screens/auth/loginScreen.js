import React from 'react';
import {Text, View} from 'react-native';
import {LoginForm} from '../../components/forms';

class LoginScreen extends React.Component {
  handleSubmit = props => console.group(props);
  render() {
    return (
      <View>
        <LoginForm handleSubmit={this.handleSubmit} />
      </View>
    );
  }
}

export default LoginScreen;
