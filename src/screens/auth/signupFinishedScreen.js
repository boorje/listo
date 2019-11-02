import React from 'react';
import {StyleSheet, Text, View, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../../styles/textStyles';
import * as colors from '../../styles/colors';

// -- Components --
import PrimaryButton from '../../components/buttons/primaryButton';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';

class SignedupFinishedScreen extends React.Component {
  state = {
    user: {},
  };

  componentDidMount = async () => {
    try {
      const user = this.props.navigation.getParam('user', null);
      this.setState({user});
    } catch (error) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={textStyles.loginHeadline}>Registreringen lyckades</Text>

          <View style={styles.button}>
            <PrimaryButton
              title="Let's get started!"
              onPress={() =>
                this.props.navigation.navigate('Home', {user: this.state.user})
              }
            />
          </View>
        </View>
      </View>
    );
  }
}

export default SignedupFinishedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
  },
  button: {
    alignSelf: 'center',
    paddingTop: '10%',
    width: '70%',
  },
});
