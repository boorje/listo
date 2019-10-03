import React from 'react';
import {StyleSheet, View, ScrollView, Button} from 'react-native';

import AddItem from '../components/addItem';
import ItemContainer from '../components/itemContainer';

class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'List',
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <ItemContainer />
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
