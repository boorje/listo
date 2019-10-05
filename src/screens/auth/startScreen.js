import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ButtonLarge from '../../components/buttons/buttonLarge';

const StartScreen = props => (
  <View style={styles.container}>
    <Text style={styles.title}>Start screen</Text>
    <ButtonLarge
      title="SIGN UP"
      onPress={() => props.navigation.navigate('Signup')}
    />
    <ButtonLarge
      title="LOGIN"
      onPress={() => props.navigation.navigate('Login')}
    />
  </View>
);

export default StartScreen;

const styles = StyleSheet.create({
  container: {margin: 10},
  title: {textAlign: 'center'},
});
