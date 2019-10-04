import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ItemDetails from '../components/itemDetails';

class AddItem extends React.Component {
  state = {
    addItem: false,
  };

  showDetails = () => {
    if (this.state.addItem === false) {
      this.setState({addItem: true});
    } else {
      this.setState({addItem: false});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.state.addItem ? (
          <TouchableOpacity onPress={() => this.showDetails()}>
            <Text>Lägg till vara...</Text>
          </TouchableOpacity>
        ) : (
          <ItemDetails
            open={this.state.addItem}
            closeDetails={() => this.showDetails()}
            addItem={content => this.props.addItem(content)}
          />
        )}

        <View style={{flexDirection: 'row'}}>
          <Icon
            size={32}
            name={'photo-camera'}
            color={'black'}
            onPress={() => {}}
          />
          <Icon size={32} name={'image'} color={'black'} onPress={() => {}} />
        </View>
      </View>
    );
  }
}

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    marginTop: '3%',
  },
});
