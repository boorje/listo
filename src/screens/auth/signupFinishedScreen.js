import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// -- Components --
import PrimaryButton from '../../components/buttons/primaryButton';

import * as colors from '../../config/colors';

class VerifyScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.text}>Successfully signed up.</Text>
          <Icon size={60} name="check-circle" color="green" />
        </View>
        <PrimaryButton
          title="GET STARTED"
          onPress={() => this.props.navigation.navigate('App')}
        />
      </View>
    );
  }
}

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {margin: 10},
  successBox: {
    height: 200,
    // backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    // color: '#fff',
  },
});
