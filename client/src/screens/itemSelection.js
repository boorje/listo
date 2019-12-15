import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons'; //! Use same icons
import IoniconsIcon from 'react-native-vector-icons/Ionicons'; //! Use same icons
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {useMutation, useQuery} from '@apollo/react-hooks';
//components
import ScreenHeader from '../components/screenHeader';
import PrimaryButton from '../components/buttons/primaryButton';
import GroceryForm from '../components/forms/groceryForm';
//styles
import * as colors from '../styles/colors';
import textStyles from '../styles/textStyles';
//api
import * as queries from '../api/queries';
import * as mutations from '../api/mutations';

function GroceryItem(props) {
  const [detailsOpen, toggleDetails] = useState(false);
  const [selected, select] = useState(false);
  const {grocery, updateGrocery, selectGrocery, removeSelectedGrocery} = props;

  return (
    <TouchableHighlight
      style={{flex: 1}}
      fontSize={50}
      onPress={() => {
        selected ? removeSelectedGrocery(grocery) : selectGrocery(grocery);
        select(!selected);
      }}
      underlayColor={'transparent'}>
      <Animated.View style={[styles.container2]}>
        <View style={{flex: 1, paddingLeft: '5%'}}>
          {detailsOpen ? (
            <View>
              <GroceryForm
                closeGroceryForm={() => toggleDetails(!detailsOpen)}
                addGrocery={updateGrocery}
                item={grocery}
                shouldCloseOnSubmit={true}
              />
            </View>
          ) : (
            <View style={styles.textInfo}>
              <Text style={textStyles.default}>{grocery.name}</Text>
              <Text style={textStyles.groceryDetails}>{grocery.quantity}</Text>
              <Text style={textStyles.groceryDetails}>{grocery.unit}</Text>
            </View>
          )}
        </View>
        <Animated.View>
          <Icon
            size={32}
            name={detailsOpen ? 'expand-less' : 'expand-more'}
            color="black"
            onPress={() => {
              toggleDetails(!detailsOpen);
            }}
          />
        </Animated.View>
        <IoniconsIcon
          style={styles.iconStyle}
          size={30}
          color={colors.primaryColor}
          name={selected ? 'ios-radio-button-on' : 'ios-radio-button-off'}
        />
      </Animated.View>
    </TouchableHighlight>
  );
}

GroceryItem.propTypes = {
  grocery: PropTypes.shape({
    name: PropTypes.string.isRequired,
    quantity: PropTypes.string,
    unit: PropTypes.string,
  }).isRequired,
};

export default function ItemSelection(props) {
  const [groceries, setGroceries] = useState(
    props.navigation.getParam('detectedItems', null),
  );
  const [selectedGroceries, setSelectedGrocery] = useState([]);
  const {
    data: {list},
    loading: fetchingList,
    error: listError,
  } = useQuery(queries.GET_ACTIVE_LIST);
  if (fetchingList) console.log('Fetching list..');
  if (listError) console.log('LISTERRORFETCH: ', listError);

  const [addGroceryItems, {loading: addingItems}] = useMutation(
    mutations.CREATE_GROCERY_LIST_ITEMS,
    {
      update(cache, {data}) {
        const {getGroceryListItems} = cache.readQuery({
          query: queries.GET_GROCERY_LIST_ITEMS,
          variables: {list: list.id},
        });
        // add the items to the list
        cache.writeQuery({
          query: queries.GET_GROCERY_LIST_ITEMS,
          variables: {list: list.id},
          data: {
            getGroceryListItems: [
              ...getGroceryListItems,
              ...data.createGroceryItems.items,
            ],
          },
        });
      },
      onCompleted() {
        props.navigation.navigate('List');
      },
      onError(err) {
        console.log('ERROR ADDING: ', err);
      },
    },
  );

  function selectGrocery(grocery) {
    setSelectedGrocery([...selectedGroceries, grocery]);
  }

  function removeSelectedGrocery(grocery) {
    setSelectedGrocery(selectedGroceries.splice(0, grocery.index));
  }

  function addItems() {
    if (!list || !list.id) {
      // TODO: Add error
    } else {
      const items = selectedGroceries.map(({name, quantity, unit}) => ({
        name,
        quantity: quantity,
        unit,
        list: list.id,
      }));
      addGroceryItems({variables: {items}});
    }
  }

  function updateGrocery(updatedGrocery) {
    const groceriesCopy = groceries.map(grocery => {
      if (grocery.id === updatedGrocery.id) {
        grocery = {...updatedGrocery};
      }
      return grocery;
    });
    setGroceries(groceriesCopy);
  }

  return groceries ? (
    <View style={styles.container}>
      <ScreenHeader
        leftIcon="ios-arrow-round-back"
        leftIconPress={() => props.navigation.pop(2)}
        rightIcon1="ios-close"
        rightIcon1Press={() => props.navigation.pop(3)}
      />
      <KeyboardAwareFlatList
        style={{marginTop: 10}}
        scrollEnabled={true}
        data={groceries}
        renderItem={({item}) => (
          <GroceryItem
            grocery={item}
            updateGrocery={updateGrocery}
            selectGrocery={selectGrocery}
            removeSelectedGrocery={removeSelectedGrocery}
          />
        )}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={() => (
          <View style={styles.button}>
            {addingItems ? (
              <Text>adding items..</Text>
            ) : (
              <PrimaryButton title="Add" onPress={() => addItems()} />
            )}
          </View>
        )}
      />
    </View>
  ) : (
    <SafeAreaView>
      <Text>Loading..</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '3%',
    paddingRight: '3%',
    paddingBottom: '3%',
    marginRight: -1,
  },
  separator: {
    height: 0.5,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: '#607D8B',
  },
  textInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: '60%',
    marginTop: '10%',
    alignSelf: 'center',
  },
  iconStyle: {
    marginRight: '1%',
    marginLeft: '3%',
  },
});
