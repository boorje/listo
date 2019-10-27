import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import GroceryForm from './forms/groceryForm';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';

export default class AddGroceryFooter extends React.Component {
  state = {
    addItemOpen: this.props.addItemOpen,
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.props.addItemOpen ? (
          <TouchableOpacity onPress={() => this.props.showAddGrocery()}>
            <Text style={textStyles.default}>Lägg till vara...</Text>
          </TouchableOpacity>
        ) : (
          <View style={{paddingTop: 10}}>
            <GroceryForm
              closeGroceryForm={this.props.showAddGrocery}
              addGrocery={this.props.addGrocery}
            />
          </View>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

AddGroceryFooter.propTypes = {
  addItemOpen: PropTypes.bool.isRequired,
  showAddGrocery: PropTypes.func.isRequired,
  addGrocery: PropTypes.func.isRequired,
};
