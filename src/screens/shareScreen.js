import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Auth} from 'aws-amplify';

import PrimaryButton from '../components/buttons/primaryButton';

class ShareScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Delningsinställningar',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Delas med: </Text>
        <ScrollView></ScrollView>
      </View>
    );
  }
}
export default ShareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
});
