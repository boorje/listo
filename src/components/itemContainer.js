import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ItemDetails from '../components/itemDetails';

class ItemContainer extends React.Component {
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
  renderList(item) {
    return (
      <TouchableHighlight
        style={styles.container1}
        backgroundColor={'white'}
        underlayColor={'transparent'}
        fontSize={50}
        onPress={() => {}}>
        <View style={styles.container2}>
          <View style={styles.info}>
            {!this.state.showDetails ? (
              <Text style={styles.text}>Hej</Text>
            ) : (
              <ItemDetails
                open={this.state.showDetails}
                closeDetails={() => this.showDetails()}
                addItem={items => this.props.addItem(items)}
              />
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

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.items}
          renderItem={item => {
            return this.renderList(item);
          }}
          keyExtractor={item => item}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  }
}

export default ItemContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  separator: {
    height: 2,
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
  },
});
