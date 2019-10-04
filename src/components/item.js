import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ItemDetails from '../components/itemDetails';

class Item extends React.Component {
  state = {
    showDetails: false,
  };

  showDetails = () => {
    if (this.state.showDetails === false) {
      this.setState({showDetails: true});
    } else {
      this.setState({showDetails: false});
    }
  };

  render() {
    return (
      <TouchableHighlight
        style={styles.container}
        backgroundColor={'white'}
        underlayColor={'transparent'}
        fontSize={50}
        onPress={() => {}}>
        <View style={styles.container2}>
          <View style={styles.info}>
            {!this.state.showDetails ? (
              <Text style={styles.text}>{this.props.name}</Text>
            ) : (
              <ItemDetails open={this.state.showDetails} />
            )}
          </View>
          <Icon
            size={32}
            name={!this.state.showDetails ? 'expand-more' : 'expand-less'}
            color={'black'}
            onPress={() => {
              this.showDetails();
            }}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

export default Item;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {},
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingBottom: '3%',
  },
  text: {
    fontSize: 20,
  },
});
