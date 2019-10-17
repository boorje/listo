import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

export default class AddGroceryListFooter extends React.Component {
  render() {
    return (
      <IoniconsIcon
        size={68}
        style={styles.icon}
        color={'#F46706'}
        name="ios-add-circle"
        onPress={() => this.props.addGroceryList()}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {position: 'absolute', bottom: '10%', right: '10%', opacity: 0.8},
});

AddGroceryListFooter.propTypes = {
  addGroceryList: PropTypes.func.isRequired,
};
