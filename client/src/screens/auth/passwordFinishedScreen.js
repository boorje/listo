import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import textStyles from '../../styles/textStyles';
import * as colors from '../../styles/colors';

// -- Components --
import PrimaryButton from '../../components/buttons/primaryButton';

class PasswordFinishedScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={textStyles.loginHeadline}>
            Password successfully reset!
          </Text>
          <View style={styles.button}>
            <PrimaryButton
              title="Sign in"
              onPress={() => this.props.navigation.navigate('Login')}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default PasswordFinishedScreen;

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
