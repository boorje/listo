import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ItemDetails from './itemDetails';
import textStyles from '../styles/textStyles';

class AddItem extends React.Component {
  state = {
    addItemOpen: this.props.addItemOpen,
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.props.addItemOpen ? (
          <TouchableOpacity onPress={() => this.props.showAddItem()}>
            <Text style={textStyles.default}>Lägg till vara...</Text>
          </TouchableOpacity>
        ) : (
          <ItemDetails
            closeDetails={() => this.props.showAddItem()}
            addGrocery={this.props.addGrocery}
          />
        )}
        <View style={styles.icons}>
          <IoniconsIcon
            style={{marginRight: '3%'}}
            size={37}
            name={'ios-camera'}
            color={'black'}
            onPress={() => {}}
          />
          <IoniconsIcon
            style={{marginRight: '3%'}}
            size={32}
            name={'md-images'}
            color={'black'}
            onPress={() => {}}
          />
        </View>
      </View>
    );
  }
}

export default AddItem;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
