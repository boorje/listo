import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Settings',
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>Delas med: </Text>
        </ScrollView>
      </View>
    );
  }
}
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
});
