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
          <View style={{flex: 1}}>
            <View style={styles.sideIcons}>
              <IoniconsIcon
                style={styles.sideIconStyle}
                size={50}
                name={'ios-camera'}
                color={'white'}
                onPress={() => {}}
              />
              <IoniconsIcon
                style={styles.sideIconStyle}
                size={40}
                name={'md-images'}
                color={'white'}
                onPress={() => {}}
              />
            </View>
            <View style={styles.addIconView}>
              <IoniconsIcon
                style={styles.addIcon}
                size={100}
                name={'ios-add-circle'}
                color={'#06BA63'}
                onPress={() => this.props.showAddGrocery()}
              />
            </View>
          </View>
        ) : (
          <View style={{paddingTop: 10}}>
            <GroceryForm
              closeGroceryForm={this.props.showAddGrocery}
              addGrocery={this.props.addGrocery}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sideIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E3E3E3',
    paddingRight: '10%',
    paddingLeft: '10%',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  addIconView: {
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    top: '-47%',
    borderRadius: 50,
  },
  addIcon: {
    marginBottom: -20,
    marginTop: -11,
    marginRight: -1,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  sideIconStyle: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
});

AddGroceryFooter.propTypes = {
  addItemOpen: PropTypes.bool.isRequired,
  showAddGrocery: PropTypes.func.isRequired,
  addGrocery: PropTypes.func.isRequired,
};
