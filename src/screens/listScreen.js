import React from 'react';
import {StyleSheet, View, ScrollView, Button} from 'react-native';

import AddItem from '../components/addItem';
import ItemContainer from '../components/itemContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';

class ListScreen extends React.Component {
  state = {
    items: [],
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Adam',
      headerRight: (
        <Icon
          style={{marginRight: 10}}
          size={32}
          name={'settings'}
          color={'black'}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
      ),
    };
  };

  addItem = content => {
    this.setState({items: [...this.state.items, content]});
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always">
          <ItemContainer
            items={this.state.items}
            addItem={content => this.props.addItem(content)}
          />
          <AddItem addItem={content => this.addItem(content)} />
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
