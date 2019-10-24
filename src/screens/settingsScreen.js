import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Auth} from 'aws-amplify';

import PrimaryButton from '../components/buttons/primaryButton';
import ScreenHeader from '../components/screenHeader';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _logout = async () => {
    try {
      await Auth.signOut();
      this.props.navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScreenHeader
          leftIconPress={() => this.props.navigation.goBack()}
          leftIcon={'ios-arrow-round-back'}
          headerTitle={'Inställningar'}
          background={BACKGROUND_URL}
        />
        <View style={styles.button}>
          <PrimaryButton title="Logga ut" onPress={() => this._logout()} />
        </View>
      </View>
    );
  }
}
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 1,
    alignSelf: 'center',
    width: '70%',
    position: 'absolute',
    bottom: '10%',
  },
});
