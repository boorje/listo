import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Button,
  ScrollView,
} from 'react-native';

import ListOfLists from '../components/listOfLists';
import Headline from '../components/headline';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    return (
      <View style={styles.container}>
        <Headline title={'Listor'} />
        <ScrollView>
          <ListOfLists />
          <Button
            title="Lägg till lista..."
            onPress={() => this.props.navigation.navigate('List')}
          />
        </ScrollView>
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
});
