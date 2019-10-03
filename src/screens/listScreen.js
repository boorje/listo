import React from 'react';
import {StyleSheet, View, ScrollView, Button} from 'react-native';

import Headline from '../components/headline';
import AddItem from '../components/addItem';

class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'List',
  };

  render() {
    return (
      <View style={styles.container}>
        <Headline title={'Adam'} />
        <ScrollView>
          <AddItem />
        </ScrollView>
      </View>
    );
  }
}
export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
});
