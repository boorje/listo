import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
  RefreshControl,
  Dimensions,
  Easing,
  LayoutAnimation,
} from 'react-native';
import {useQuery, useMutation} from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
// components
import GroceryForm from './forms/groceryForm';
import EmptyListInfo from './emptyListInfo';
// styles
import textStyles from '../styles/textStyles';
import * as colors from '../styles/colors';
import animations from '../styles/animations';
// api
import * as queries from '../api/queries';
import * as mutations from '../api/mutations';

const {width, height} = Dimensions.get('window');
const {Value} = Animated;

function GroceryItem(props) {
  const [detailsOpen, toggleDetails] = useState(false);
  const {addItemOpen, grocery, removeGrocery, updateGrocery} = props;
  const itemX = new Value(0);

  return (
    <TouchableHighlight
      style={{flex: 1}}
      fontSize={50}
      onPress={() => {
        if (!detailsOpen && !addItemOpen) {
          removeGrocery(grocery.id);
        }
      }}
      underlayColor={'transparent'}>
      <Animated.View style={[styles.container2, {left: itemX}]}>
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
              <View style={styles.units}>
                <Text style={textStyles.groceryDetails}>
                  {grocery.quantity}
                </Text>
                <Text style={textStyles.groceryDetails}>{grocery.unit}</Text>
              </View>
            </View>
          )}
        </View>
        <Animated.View>
          <Icon
            size={32}
            name={detailsOpen ? 'expand-less' : 'expand-more'}
            color="black"
            onPress={() => {
              if (!addItemOpen) {
                LayoutAnimation.configureNext(animations.default);
                toggleDetails(!detailsOpen);
              }
            }}
          />
        </Animated.View>
      </Animated.View>
    </TouchableHighlight>
  );
}

GroceryItem.propTypes = {
  grocery: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  addItemOpen: PropTypes.bool.isRequired,
  removeGrocery: PropTypes.func.isRequired,
  updateGrocery: PropTypes.func.isRequired,
};

export default function GroceriesContainer(props) {
  const {data, loading, error, refetch, networkStatus} = useQuery(
    queries.GET_GROCERY_LIST_ITEMS,
    {
      variables: {list: props.listId},
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-first',
    },
  );
  const [deleteItem] = useMutation(mutations.DELETE_GROCERY_LIST_ITEM, {
    update(cache, {data}) {
      const {getGroceryListItems} = cache.readQuery({
        query: queries.GET_GROCERY_LIST_ITEMS,
        variables: {list: props.listId},
      });
      cache.writeQuery({
        query: queries.GET_GROCERY_LIST_ITEMS,
        variables: {list: props.listId},
        data: {
          getGroceryListItems: getGroceryListItems.filter(
            item => item.id !== data.deleteGroceryListItem.item.id,
          ),
        },
      });
    },
    onError(error) {
      console.log('ERROR\n ', error);
    },
  });
  const [updateItem] = useMutation(mutations.UPDATE_GROCERY_ITEM);

  if (error) console.log(error);

  return (
    <View style={{flex: 1}}>
      <View style={styles.groceries}>
        {data &&
        data.getGroceryListItems &&
        data.getGroceryListItems.length > 0 ? (
          <KeyboardAwareFlatList
            contentContainerStyle={{marginBottom: 10}}
            scrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={networkStatus === 4}
                onRefresh={() => refetch()}
                tintColor={colors.primaryColor}
              />
            }
            data={data.getGroceryListItems}
            renderItem={({item}) => (
              <GroceryItem
                grocery={item}
                addItemOpen={props.addItemOpen}
                removeGrocery={id => {
                  deleteItem({variables: {id}});
                }}
                updateGrocery={input => updateItem({variables: {input}})}
              />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyboardShouldPersistTaps="always"
          />
        ) : (
          <EmptyListInfo emoji={props.addItemOpen ? '😃' : '🥺'} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groceries: {
    position: 'absolute',
    top: '-9%',
    height: '110%',
    backgroundColor: 'white',
    paddingTop: '3%',
    width: '95%',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: '2%',
    paddingRight: '3%',
    paddingVertical: 6,
  },
  separator: {
    height: 1,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: 'gray',
  },
  textInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  units: {
    flexDirection: 'row',
    marginLeft: '3%',
  },
});

GroceriesContainer.propTypes = {
  listId: PropTypes.string.isRequired,
  addItemOpen: PropTypes.bool.isRequired,
};
