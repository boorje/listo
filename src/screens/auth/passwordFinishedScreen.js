import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// -- Components --
import PrimaryButton from '../../components/buttons/primaryButton';

class PasswordFinishedScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.text}>Successfully reset your password</Text>
          <Icon size={60} name="check-circle" color="green" />
        </View>
        <PrimaryButton
          title="LOGIN"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    );
  }
}

export default PasswordFinishedScreen;

const styles = StyleSheet.create({
  container: {margin: 10},
  successBox: {
    height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
