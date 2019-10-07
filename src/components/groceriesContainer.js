import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import GroceryForm from './forms/groceryForm';
import textStyles from '../styles/textStyles';

class GroceriesContainer extends React.Component {
  renderList(item, index) {
    return (
      <TouchableHighlight
        style={styles.container1}
        fontSize={50}
        onPress={() => {
          this.props.removeItem(index);
        }}
        underlayColor={'transparent'}>
        <View style={styles.container2}>
          <View style={styles.info}>
            {!item.details ? (
              <Text style={textStyles.default}>{item.content}</Text>
            ) : (
              <GroceryForm
                closeGroceryForm={() => this.props.showGroceryForm(item, index)}
                addGrocery={this.props.updateItem}
                content={item.content}
                quantity={item.quantity}
                unit={item.unit}
              />
            )}
          </View>
          <Icon
            size={32}
            name={!item.details ? 'expand-more' : 'expand-less'}
            color={'black'}
            onPress={() => {
              this.props.showGroceryForm(item, index);
            }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <FlatList
        scrollEnabled={false}
        data={this.props.items}
        renderItem={({item, index}) => {
          return this.renderList(item, index);
        }}
        keyExtractor={item => item}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        keyboardShouldPersistTaps="always"
      />
    );
  }
}

export default GroceriesContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  separator: {
    height: 1,
    width: '97%',
    marginLeft: '3%',
    marginRight: '0%',
    backgroundColor: '#607D8B',
  },
  container1: {
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
    fontFamily: 'Avenir Next',
  },
});
