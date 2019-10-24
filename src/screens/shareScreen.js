import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {Auth} from 'aws-amplify';

import ScreenHeader from '../components/screenHeader';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1552664862-db5607e91378?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';

class ShareScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <ScreenHeader
          leftIconPress={() => this.props.navigation.goBack()}
          leftIcon={'ios-arrow-round-back'}
          headerTitle={'Delning'}
          background={BACKGROUND_URL}
        />
      </View>
    );
  }
}
export default ShareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
