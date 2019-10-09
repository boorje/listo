import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';

export default class AddGroceryListFooter extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.addGroceryList()}>
          <Text style={textStyles.default}>Lägg till lista...</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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

AddGroceryListFooter.propTypes = {
  addGroceryList: PropTypes.func.isRequired,
};
