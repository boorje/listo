import React from 'react';
import {StyleSheet, View, ScrollView, Button} from 'react-native';

import AddItem from '../components/addItem';
import ItemContainer from '../components/itemContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';

class ListScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Adam',
    headerRight: (
      <Icon
        style={{marginRight: 10}}
        size={32}
        name={'settings'}
        color={'black'}
        onPress={() => {}}
      />
    ),
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
