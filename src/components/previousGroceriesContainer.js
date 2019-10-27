import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  LayoutAnimation,
} from 'react-native';
import PropTypes from 'prop-types';
import textStyles from '../styles/textStyles';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import animations from '../styles/animations';
import PrimaryButton from '../components/buttons/primaryButton';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

// -- API helpers --
import {createGroceryItem} from '../api/groceryListsAPI';

class PreviousGroceriesContainer extends React.Component {
  state = {
    groceries: [
      {id: '1', content: 'Cola', quantity: 2, unit: 'kg', selected: false},
      {id: '2', content: 'Fanta', quantity: 2, unit: 'kg', selected: false},
      {id: '3', content: 'Sprite', quantity: 2, unit: 'kg', selected: false},
      {id: '4', content: '7Up', quantity: 2, unit: 'kg', selected: false},
    ],
    groceryListID: '',
    apiError: '',
  };

  selectGrocery = item => {
    const stateCopy = this.state.groceries.map(grocery => {
      if (grocery.id === item.id) {
        grocery.selected === false
          ? (grocery.selected = true)
          : (grocery.selected = false);
      }
      return grocery;
    });
    LayoutAnimation.spring();
    this.setState({groceries: stateCopy});
  };

  addGrocery = async grocery => {
    // try {
    //   const newGroceryID = await createGroceryItem(
    //     grocery,
    //     this.state.groceryListID,
    //   );
    //   const {content, quantity, unit} = grocery;
    //   LayoutAnimation.spring();
    //   this.setState({
    //     groceries: [
    //       ...this.state.groceries,
    //       {
    //         content,
    //         quantity,
    //         unit,
    //         details: false,
    //         id: newGroceryID,
    //       },
    //     ],
    //   });
    // } catch (error) {
    //   this.props.updateApiError(error);
    // }
  };

  renderList(item, index) {
    return (
      <TouchableHighlight
        fontSize={50}
        onPress={() => this.selectGrocery(item)}
        underlayColor={'transparent'}>
        <View style={styles.item}>
          <View style={styles.text}>
            <Text style={textStyles.default}>{item.content}</Text>
          </View>
          {!item.selected ? (
            <IoniconsIcon
              style={styles.iconStyle}
              size={30}
              color={'#06BA63'}
              name={'ios-radio-button-off'}
            />
          ) : (
            <IoniconsIcon
              style={styles.iconStyle}
              size={30}
              color={'#06BA63'}
              name={'ios-radio-button-on'}
            />
          )}
        </View>
      </TouchableHighlight>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  addButton = (
    <View style={styles.button}>
      <PrimaryButton title="Lägg till" onPress={() => {}} />
    </View>
  );

  render() {
    const {groceries} = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareFlatList
          scrollEnabled={true}
          data={groceries}
          renderItem={({item, index}) => {
            return this.renderList(item, index);
          }}
          keyExtractor={({id}) => id}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyboardShouldPersistTaps="always"
          ListFooterComponent={this.addButton}
        />
      </View>
    );
  }
}

export default PreviousGroceriesContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: '3%',
  },
  text: {
    paddingLeft: '3%',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconStyle: {
    paddingRight: '5%',
  },
  separator: {
    height: 0.5,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: '#607D8B',
  },
  button: {
    paddingTop: '10%',
    width: '70%',
    alignSelf: 'center',
  },
});

PreviousGroceriesContainer.propTypes = {
  // updateApiError: PropTypes.func.isRequired,
  // navigation: PropTypes.object.isRequired,
};
